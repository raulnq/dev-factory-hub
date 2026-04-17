import PDFDocument from 'pdfkit';
import { ENV } from '#/env.js';
import { getFileBuffer } from './s3-client.js';

type ClientData = {
  name: string;
  address: string | null;
  documentNumber: string | null;
  phone: string | null;
};

type ProformaData = {
  number: string;
  projectName: string;
  startDate: string;
  endDate: string;
  currency: string;
  subtotal: number;
  expenses: number;
  discount: number;
  taxes: number;
  total: number;
};

type ProformaItemData = {
  description: string;
  amount: number;
};

const LEFT = 50;
const RIGHT_EDGE = 545; // A4 width (595) - 50 margin

// Totals grid dimensions — shared between items table and totals section
const TOTALS_WIDTH = 250;
const TOTALS_START_X = RIGHT_EDGE - TOTALS_WIDTH;
const LABEL_W = 120;
const CUR_W = 30;
const AMT_W = TOTALS_WIDTH - LABEL_W - CUR_W;
const ROW_H = 20;

export async function generateProformaPdf(
  proforma: ProformaData,
  clientData: ClientData,
  items: ProformaItemData[]
): Promise<Buffer> {
  const logoBuffer = ENV.COMPANY_LOGO_KEY
    ? await getFileBuffer(ENV.COMPANY_LOGO_KEY)
    : null;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const cur = proforma.currency;

    drawHeader(doc, proforma, logoBuffer);
    const afterClient = drawClientSection(doc, clientData);
    const afterTable = drawItemsTable(doc, items, cur, afterClient);
    drawTotals(doc, proforma, cur, afterTable);

    doc.end();
  });
}

// ─── HEADER: Logo + Company info + Proforma info ────────────────────────────

function drawHeader(
  doc: PDFKit.PDFDocument,
  proforma: ProformaData,
  logoBuffer: Buffer | null
) {
  const logoWidth = 115;

  if (logoBuffer) {
    doc.image(logoBuffer, LEFT + 5, 30, { width: logoWidth });
  }

  // Company name — centered between logo and proforma info
  const companyX = LEFT + logoWidth + 15;
  const companyBlockWidth = 210;

  doc.fontSize(14).font('Helvetica-Bold');
  doc.text(ENV.COMPANY_NAME, companyX, 38, {
    width: companyBlockWidth,
    align: 'center',
  });

  // Address lines
  doc.fontSize(9).font('Helvetica');
  const addrY = 60;
  doc.text(ENV.COMPANY_ADDRESS, companyX, addrY, {
    width: companyBlockWidth,
    align: 'center',
  });
  doc.text(ENV.COMPANY_STATE, companyX, addrY + 12, {
    width: companyBlockWidth,
    align: 'center',
  });
  doc.text(ENV.COMPANY_COUNTRY, companyX, addrY + 24, {
    width: companyBlockWidth,
    align: 'center',
  });

  // Proforma number — right side, bold, same font size as labels
  const rightInfoX = 400;
  const rightValueX = 460;
  const rightValueW = RIGHT_EDGE - rightValueX;

  doc.fontSize(9).font('Helvetica-Bold');
  doc.text('Proforma:', rightInfoX, addrY);
  doc.text('Project:', rightInfoX, addrY + 14);
  doc.text('From:', rightInfoX, addrY + 28);
  doc.text('To:', rightInfoX, addrY + 42);

  doc.font('Helvetica').fontSize(9);
  doc.text(proforma.number, rightValueX, addrY);
  const trimmedProject = truncateText(doc, proforma.projectName, rightValueW);
  doc.text(trimmedProject, rightValueX, addrY + 14);
  doc.text(formatDate(proforma.startDate), rightValueX, addrY + 28);
  doc.text(formatDate(proforma.endDate), rightValueX, addrY + 42);
}

// ─── CLIENT SECTION ─────────────────────────────────────────────────────────

function drawClientSection(
  doc: PDFKit.PDFDocument,
  clientData: ClientData
): number {
  // Start below the logo (logo ~140px tall starting at y=30)
  let y = 190;

  const labelX = LEFT + 10;
  const valueX = LEFT + 130;
  const rowH = 20;

  const drawField = (label: string, value: string) => {
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(label, labelX, y);
    doc.font('Helvetica');
    doc.text(value, valueX, y, {
      width: RIGHT_EDGE - valueX - 10,
      lineBreak: false,
      ellipsis: true,
    });
    y += rowH;
  };

  drawField('Client:', clientData.name);
  drawField('Address:', clientData.address ?? '');
  drawField('Document Number:', clientData.documentNumber ?? '');
  drawField('Phone:', clientData.phone ?? '');

  return y;
}

// ─── ITEMS TABLE ────────────────────────────────────────────────────────────

function drawItemsTable(
  doc: PDFKit.PDFDocument,
  items: ProformaItemData[],
  cur: string,
  startY: number
): number {
  let y = startY + 10;

  // Description spans from LEFT to the currency column (TOTALS_START_X + LABEL_W)
  // Currency + Amount columns align with the totals grid below
  const descColW = TOTALS_START_X + LABEL_W - LEFT;
  const amtHeaderW = CUR_W + AMT_W;

  // Table header row — white background, bordered, bold black text
  doc.rect(LEFT, y, descColW, ROW_H).stroke();
  doc.fontSize(9).font('Helvetica-Bold');
  doc.text('Description', LEFT + 6, y + 5, { width: descColW - 10 });

  doc.rect(LEFT + descColW, y, amtHeaderW, ROW_H).stroke();
  doc.text('Amount', LEFT + descColW, y + 5, {
    width: amtHeaderW - 6,
    align: 'right',
  });

  y += ROW_H;

  // Table rows
  doc.font('Helvetica').fontSize(9);

  for (const item of items) {
    // Description cell — spans full width up to currency column
    doc.rect(LEFT, y, descColW, ROW_H).stroke();
    doc.text(item.description, LEFT + 6, y + 5, {
      width: descColW - 10,
      lineBreak: false,
      ellipsis: true,
    });

    // Currency symbol cell — aligned with totals currency column
    doc.rect(TOTALS_START_X + LABEL_W, y, CUR_W, ROW_H).stroke();
    doc.text(cur, TOTALS_START_X + LABEL_W + 4, y + 5, {
      width: CUR_W - 8,
      align: 'left',
    });

    // Amount value cell — aligned with totals amount column
    doc.rect(TOTALS_START_X + LABEL_W + CUR_W, y, AMT_W, ROW_H).stroke();
    doc.text(
      formatNumber(item.amount),
      TOTALS_START_X + LABEL_W + CUR_W + 4,
      y + 5,
      {
        width: AMT_W - 8,
        align: 'right',
      }
    );

    y += ROW_H;
  }

  return y;
}

// ─── TOTALS ─────────────────────────────────────────────────────────────────

function drawTotals(
  doc: PDFKit.PDFDocument,
  proforma: ProformaData,
  cur: string,
  startY: number
) {
  let y = startY;

  const drawRow = (label: string, value: number, bold = false) => {
    const font = bold ? 'Helvetica-Bold' : 'Helvetica';
    doc.font(font).fontSize(9);

    // Label cell
    doc.rect(TOTALS_START_X, y, LABEL_W, ROW_H).stroke();
    doc.text(label, TOTALS_START_X + 4, y + 5, {
      width: LABEL_W - 8,
      align: 'right',
    });

    // Currency symbol cell
    doc.rect(TOTALS_START_X + LABEL_W, y, CUR_W, ROW_H).stroke();
    doc.text(cur, TOTALS_START_X + LABEL_W + 4, y + 5, {
      width: CUR_W - 8,
      align: 'left',
    });

    // Amount cell
    doc.rect(TOTALS_START_X + LABEL_W + CUR_W, y, AMT_W, ROW_H).stroke();
    doc.text(formatNumber(value), TOTALS_START_X + LABEL_W + CUR_W + 4, y + 5, {
      width: AMT_W - 8,
      align: 'right',
    });

    y += ROW_H;
  };

  drawRow('SUBTOTAL', proforma.subtotal);
  drawRow('EXPENSES', proforma.expenses);
  drawRow('DISCOUNT', proforma.discount);
  drawRow('TAXES', proforma.taxes);
  drawRow('TOTAL', proforma.total, true);
}

// ─── UTILS ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatNumber(num: number): string {
  return num.toFixed(2);
}

function truncateText(
  doc: PDFKit.PDFDocument,
  text: string,
  maxWidth: number
): string {
  if (doc.widthOfString(text) <= maxWidth) return text;
  const ellipsis = '...';
  let truncated = text;
  while (
    truncated.length > 0 &&
    doc.widthOfString(truncated + ellipsis) > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + ellipsis;
}

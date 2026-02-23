Add-Type -AssemblyName PresentationCore
$player = New-Object System.Windows.Media.MediaPlayer
$player.Open([uri]"$PSScriptRoot\work_complete.mp3")
$player.Play()
Start-Sleep -Seconds 5
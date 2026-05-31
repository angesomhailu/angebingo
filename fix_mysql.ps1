Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
$mysqlPath = "C:\xampp\mysql\bin"
Start-Process -FilePath "$mysqlPath\mysqld.exe" -ArgumentList "--skip-grant-tables", "--bind-address=127.0.0.1" -WindowStyle Hidden

$maxRetries = 20
$retryCount = 0
$connected = $false
while (-not $connected -and $retryCount -lt $maxRetries) {
    Start-Sleep -Seconds 2
    $result = & "$mysqlPath\mysql.exe" -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $connected = $true
    }
    $retryCount++
}

if (-not $connected) {
    Write-Host "Failed to start MariaDB in skip-grant-tables mode."
    exit 1
}

$sql = @"
FLUSH PRIVILEGES;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'A1`$`$`$`$`$`$`$`$`$`$a2';
ALTER USER 'root'@'localhost' IDENTIFIED BY 'A1`$`$`$`$`$`$`$`$`$`$a2';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;

CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY 'A1`$`$`$`$`$`$`$`$`$`$a2';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY 'A1`$`$`$`$`$`$`$`$`$`$a2';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;

CREATE USER IF NOT EXISTS 'root'@'::1' IDENTIFIED BY 'A1`$`$`$`$`$`$`$`$`$`$a2';
ALTER USER 'root'@'::1' IDENTIFIED BY 'A1`$`$`$`$`$`$`$`$`$`$a2';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'::1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
"@

$sql | Out-File -FilePath "$env:TEMP\fix_mysql.sql" -Encoding ascii
cmd.exe /c "`"$mysqlPath\mysql.exe`" -u root < `"$env:TEMP\fix_mysql.sql`""

Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

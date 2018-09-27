@echo off
echo | set /p=http://localhost:80
call node_modules\.bin\opn.cmd http://localhost:80
call node_modules\.bin\serve.cmd --listen 80 > nul
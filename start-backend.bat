@echo off
chcp 65001 >nul
set JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8 -Dconsole.encoding=UTF-8
echo Starting SuperSTO Backend with UTF-8 encoding...
cd backend
mvn spring-boot:run
pause 
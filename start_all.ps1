# Siren Local Startup Script
# This script starts all 4 components of the Siren project in separate terminal windows.

# 1. Django Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Siren\siren-backend'; ..\.venv\Scripts\activate; python manage.py runserver"

# 2. Django Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Siren\siren-backend'; npm start"

# 3. Flask Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Siren\flask_engine'; ..\.venv\Scripts\activate; python app.py"

# 4. Flask Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Siren\flask_engine\frontend'; npm start"

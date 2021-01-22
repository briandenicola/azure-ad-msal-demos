import os

CLIENT_ID = "{guid}" 
CLIENT_SECRET = "{client_secret}" 
AUTHORITY = "https://login.microsoftonline.com/{tenat_id}"
REDIRECT_PATH = "/getAToken"  
ENDPOINT = 'https://localhost:5001/weatherforecast/getapp'
SCOPE = ["api://{guid}/.default"]
SESSION_TYPE = "filesystem"  
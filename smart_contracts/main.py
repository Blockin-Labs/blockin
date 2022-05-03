from blockin_local import create as local_create
from blockin_global import create as global_create
import os

MNEMONIC = ""
API_TOKEN = ""
API_URL = ""
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'.env')) as envfile:
    lines = envfile.read().splitlines()
    MNEMONIC = lines[0].split(sep="=")[1][1:-1]
    API_TOKEN = lines[1].split(sep="=")[1][1:-1]
    API_URL = lines[2].split(sep="=")[1][1:-1]

print(f"local app id: {local_create(API_TOKEN, API_URL, MNEMONIC, upload=True)}")
print(f"global app id: {global_create(API_TOKEN, API_URL, MNEMONIC, upload=True)}")
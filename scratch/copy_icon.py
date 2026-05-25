import shutil
import os

src = r"C:\Users\0020223515\.gemini\antigravity\brain\a36c5e4c-f4b5-462f-910e-c8370665f262\kotobattler_favicon_1779701138724.png"
dest1 = r"c:\Users\0020223515\source\repos\vc-talk-deck\src\app\icon.png"
dest2 = r"c:\Users\0020223515\source\repos\vc-talk-deck\public\icon.png"

# 親ディレクトリ作成
os.makedirs(os.path.dirname(dest1), exist_ok=True)
os.makedirs(os.path.dirname(dest2), exist_ok=True)

try:
    shutil.copy(src, dest1)
    shutil.copy(src, dest2)
    print("SUCCESS: Icons copied successfully!")
except Exception as e:
    print("ERROR:", e)

#!/usr/bin/env python3
"""Fix branding_patch.py: move auth-login-ui definitions before main()."""
from pathlib import Path

BP = Path("/docker/open-webui-gxuq/custom/branding_patch.py")
text = BP.read_text(encoding="utf-8")

# Remove the wrongly-placed block at the end (after if __name__)
marker = '\nAUTH_LOGIN_UI_SCRIPT_TAG'
if marker in text:
    idx = text.index(marker)
    text = text[:idx].rstrip() + "\n"

# Insert the auth function BEFORE def main()
AUTH_BLOCK = '''

AUTH_LOGIN_UI_SCRIPT_TAG = "<!-- adzhub-auth-login-ui -->"
AUTH_LOGIN_UI_JS_PATH = "/static/auth-login-ui.js"


def patch_auth_login_ui_script() -> None:
    if not INDEX_HTML.is_file():
        print("branding_patch: index.html not found — skip auth-login-ui script")
        return
    text = INDEX_HTML.read_text(encoding="utf-8")
    if AUTH_LOGIN_UI_SCRIPT_TAG in text:
        return
    block = AUTH_LOGIN_UI_SCRIPT_TAG + "\\n\\t\\t" + '<script src="' + AUTH_LOGIN_UI_JS_PATH + '" defer></script>'
    idx = text.lower().rfind("</body>")
    if idx == -1:
        print("branding_patch: </body> not found — skip auth-login-ui")
        return
    new_text = text[:idx] + block + "\\n" + text[idx:]
    INDEX_HTML.write_text(new_text, encoding="utf-8")
    print("branding_patch: index.html — auth-login-ui.js injected")


'''

# Insert before "def main()"
main_idx = text.index("\ndef main()")
text = text[:main_idx] + AUTH_BLOCK + text[main_idx:]

BP.write_text(text, encoding="utf-8")
print("OK: branding_patch.py fixed — auth function moved before main()")

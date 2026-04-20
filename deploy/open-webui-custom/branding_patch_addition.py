AUTH_LOGIN_UI_SCRIPT_TAG = "<!-- adzhub-auth-login-ui -->"
AUTH_LOGIN_UI_JS_PATH = "/static/auth-login-ui.js"


def patch_auth_login_ui_script() -> None:
    if not INDEX_HTML.is_file():
        print("branding_patch: index.html not found — skip auth-login-ui script")
        return
    text = INDEX_HTML.read_text(encoding="utf-8")
    if AUTH_LOGIN_UI_SCRIPT_TAG in text:
        return
    block = f"""{AUTH_LOGIN_UI_SCRIPT_TAG}\n\t\t<script src="{AUTH_LOGIN_UI_JS_PATH}" defer></script>"""
    idx = text.lower().rfind("</body>")
    if idx == -1:
        print("branding_patch: </body> not found — skip auth-login-ui")
        return
    new_text = text[:idx] + block + "\n" + text[idx:]
    INDEX_HTML.write_text(new_text, encoding="utf-8")
    print("branding_patch: index.html — auth-login-ui.js injected")

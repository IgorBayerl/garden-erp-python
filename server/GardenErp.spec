# -*- mode: python ; coding: utf-8 -*-

import os

# Assume the spec file is in the project root directory, adjust if needed.
project_root = os.getcwd()

a = Analysis(
    ['manage.py'],
    pathex=[project_root],  # Adding the project root to the search path
    binaries=[],
    # Include static files and any other necessary data files
    datas=[(os.path.join(project_root, 'staticfiles'), 'static')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='GardenErp',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,  # Set to False if you don't want a console window
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

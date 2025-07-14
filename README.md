# Para añadir el submódulo en algún proyecto, desde el root
git submodule add https://github.com/DigitalValue/DView.git carpeta_origen


# Configurar para siempre actualizar submódulos en pull y push
git config submodule.recurse true
git config push.recurseSubmodules on-demand



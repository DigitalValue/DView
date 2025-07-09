# Para añadir el submódulo en algún proyecto, desde el root
git submodule add https://github.com/DigitalValue/DView.git carpeta_origen


# Configurar para siempre actualizar submódulos en pull
git config submodule.recurse true

# O solo para este repositorio
git config --global submodule.recurse true



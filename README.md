# Para añadir el submódulo en algún proyecto diferente a zity-components, desde el root
git submodule add https://github.com/DigitalValue/DView.git carpeta_origen

# Para updatear en zity-components
git submodule update --init src/components/dview  # specific path only


# Configurar para siempre actualizar submódulos en pull
git config submodule.recurse true

# O solo para este repositorio
git config --global submodule.recurse true



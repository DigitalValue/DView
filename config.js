
// fichero de configuración ??
// idea para configurar diferentes estilos? de momento no se añade !!

export { config, setConfig }

let config = {

    fontFamily: 'Poppins, Karla, Raleway',
    h1: {},
    h2: {},
    h3: {},
    p : {},
    button : {
        // primary : {
        //     background: '#e8def8'
        // }
    }

}

function setConfig(newConfig) {
    Object.assign(config, newConfig)
}
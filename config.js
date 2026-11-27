
// fichero de configuración ??
// idea para configurar diferentes estilos? de momento no se añade !!

export { config, setConfig }

let config = {

    primaryColor: '', // to do !!
    secondaryColor: '',
    accentColor: '',
    background: '#f5f5f5',
    borderRadius: '.28571429rem',

    fontFamily: 'Poppins, Karla, Raleway, Lato, sans-serif',

    fonts: {
        h1: {
            fontSize:'2.5rem',
            lineHeight:'2.25',
            marginTop: 0,
            marginBottom:0,
        },
        h2: {
            fontSize: '1.5rem',
            lineHeight:'1.5',
            marginBottom:0,
        },
        h3: {
            fontSize:'1.25rem',
            lineHeight: '1.25',
            marginTop: 0,
            marginBottom: 0,
        },
        h4: {
            marginTop: 0,
            marginBottom: 0,
        },
        default: {
            fontSize: '1rem',
            lineHeight: '1.21428571em',
            margin: 0
        },
        small: {
            fontSize: "0.875rem",
            lineHeight: "1rem",
            margin: 0
        },
    },
    
    form: {
        baseStyle: {
            fontSize: '1rem', // es la misma fontSize que default !! mantener ratio!!
            lineHeight: '1.21428571em',
            background: '#fff',
            padding: '.67857143rem 1rem',
            borderRadius: '.28571429rem',
            border: '1px solid #ccc',
            borderColor:'#ccc',
            color: 'rgba(0, 0, 0, .87)',
            outline:'none',
            resize: "vertical"
        },
        focusStyle: {
            outline: '-webkit-focus-ring-color auto 1px',
            boxShadow: '0 0 0 0 transparent inset, 0 0 0 0 transparent',
        },
        formLabel: {
            fontSize: '1em', // misma fontSize que default !! Mantener ratio!!
            lineHeight: '1.21428571em',
            fontWeight:'normal',
            display: 'block',
            color: 'black',
            marginBottom: '0.2em',
            whiteSpace: 'normal',
        }
    },

    elements: {
       
        /*
        button: {
        }*/

    },
    
    dialogs: {

    },
    
    layout: {
        container: {
            
        }
    },

    app: {
        appBar: {
            borderBottom:`1px solid rgba(34, 36, 38, 0.15)`
            //background:'#ffffff'
        },
        //background: ''
        
    },

    colors: {
        accentRed:'#f64a59',
        blue: '#2185d0',
        
        green: '#21ba45',
        orange: '#f2711c',
        teal: '#00b5ad',
        olive: '#b5cc18',
        brown: '#a5673f',
        violet: '#6435c9',
        grey: '#dedede',
        purple: '#6435c9',
        red: '#db2828',
        lightgrey: '#f8fafc',
        // fondo del Segment secundario y del SecondaryMenu. Si una app solo cambia lightgrey,
        // setConfig lo copia aquí para que se vean como antes
        secondaryBackground: '#f8fafc',
        borderColor: '#03030326',
        secondaryText: '#555',
        inverted: '#545454',
        dark: '#334156',
        border: 'rgba(34, 36, 38, 0.15)',
        // color de lo activo: círculo del check, bola del Switch, punto del radio, casilla nativa y menús.
        // Si una app solo cambia blue, setConfig lo copia aquí para que se vea como antes
        active: '#2185d0',
        // fondo de lo activo: lo marcado (CheckboxLabel, SwitchLabel, opción activa de un menú).
        // Antes se llamaba selected: si una app solo define selected, setConfig lo copia aquí
        activeBackground: '#aecbe742',
        // fondo al pasar el ratón por las opciones de un menú (SecondaryMenu y menús de las apps)
        hoverBackground: '#ffffff',
        pageBackground:'#f1f5f9'
    }

}

function setConfig(newConfig) {

    mergeDeep(config, newConfig)

    if (newConfig.colors?.lightgrey && !newConfig.colors.secondaryBackground) {
        config.colors.secondaryBackground = newConfig.colors.lightgrey
    }

    if (newConfig.colors?.blue && !newConfig.colors.active) {
        config.colors.active = newConfig.colors.blue
    }

    if (newConfig.colors?.selected && !newConfig.colors.activeBackground) {
        config.colors.activeBackground = newConfig.colors.selected
    }

    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    
    function mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
            }
        }

        return mergeDeep(target, ...sources);
    }

    
}
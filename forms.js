import { FlexCol, FlexRow, Box, Div, Tappable  } from "./layout.js"
import { Text, SmallText } from "./texts.js"
import { Icon, Button, SVGIcon, IconButton } from './elements.js'
import { config } from "./config.js"
import { localize, translateSALT } from "./util.js"


export {
    FormLabel, Input, TranslationInput, Dropdown,
    IntegerInput, Switch, InfoTooltip, Checkbox, RadioButtons,
    HtmlIntegerInput, HtmlDropdown, DateSelector, DateInput
}




// repensar si añadir localize a estas funciones !!
function FormLabel(){
    let style = {
        fontWeight:'normal',
        display: 'block',
        color: 'black',
        fontSize: '1em',
        fontFamily: config.fontFamily,
        marginBottom: '0.2em',
        whiteSpace: 'normal',
    }

    return {
        view:(vnode)=>{
            let { required, description, info} = vnode.attrs

            return m(FlexCol, [
                m(FlexRow,
                    // label debería ser Text ??
                    m("label", {
                        style: {
                            ...(config.form?.formLabel || style),
                            fontFamily: config.fontFamily
                        }
                    }, 
                        typeof vnode.children?.[0] == 'object' ? null : vnode.children 
                    ),
                    
                    required 
                    ? m("span", {style:"color:red; margin-left:0.5em; line-height: 1.21429em;"}, '*')
                    : null,

                    info 
                    ? m(InfoTooltip,{text:info})
                    : null
                ),
              
                description
                ? m(SmallText, { paddingBottom: "5px", color: "gray" }, description)
                : null
                
            ])
        }
    }
}


function Checkbox(){

    let checkboxStyle = {
        width:'17px', 
        minWidth:'17px', 
        height:'17px',
        minHeight:'17px',
        cursor:'pointer',
        //marginBottom: "5px"
    }

    return {
        view:(vnode)=>{
            let {data, name, info, description, required, onchange,label, disabled=false, checked, vertical=false} = vnode.attrs

            return [
                m(FlexRow, { flexDirection: vertical ? "column-reverse" : "row", gap:'0.5em', alignItems:'start' },
                    
                    m("input",{
                        type:'checkbox',
                        disabled,
                        checked: data && name ? data[name] : checked,
                        style: checkboxStyle,
                        onchange:(e)=>{
                            if(data && name){
                                data[name] = e.target.checked
                            }

                            onchange ? onchange(e): ''
                        }
                    }),

                   
                    m(FormLabel, { info: info, description, required: required }, label),
                    
                )
            ]
        }
    }
}


function Input(){

    let focused = false;
    
    return {
        view: (vnode)=>{
            let { data, name, oninput, type, label, required, rows, icon,  readonly, pattern, title, onchange, disabled, placeholder, value, info, description, onkeyup} = vnode.attrs

            return [

                // TO DO: editar el estilo de focus
                m(FlexCol,{
                    width: "100%"
                }, // pensar otra manera sin necesidad de meter width: 100%
                    label 
                    ? [
                        m(FormLabel,{required: required, description, info:info}, label),
                    ] : null,

                    m(Div, {position:'relative', width:'100%', display:'flex'},
                        m(type =='textarea'? "textarea": "input", {
                            readonly: readonly || false, // es lo mismo que disabbled==
                            rows:rows,
                            style:  {
                                transition:' box-shadow 0.1s ease-in-out, outline 0.1s ease-in-out',
                                width:'100%',
                                fontFamily: config.fontFamily,
                                ...(config.form?.baseStyle),
                                ...icon ? {paddingLeft:'32px'}:{},
                                //...(config.fonts?.default || config.defaultFont || {}),
                                ...(config.form?.baseStyle),
                                ...(config.form?.input || {}),
                                ...(vnode.attrs.style || {}),
                            },
                            oninput:(e)=>{
                                data && name ? data[name] = e.target.value : ''
                                oninput ? oninput(e): ''
                            },
                            
                            onfocus:(e)=> {
                                Object.keys(config.form?.focusStyle || {}).forEach((key)=>{
                                    e.target.style[key] = config.form.focusStyle[key]
                                })

                                focused = true;
                                
                                if(vnode.attrs.onfocus){
                                    vnode.attrs.onfocus(e)
                                }
                            },
                            onblur:(e)=>{
                                focused = false;
                                Object.keys(config.form?.focusStyle || {}).forEach((key)=>{
                                    e.target.style[key] = config.form.baseStyle[key]
                                })

                                if(vnode.attrs.onblur){
                                    vnode.attrs.onblur(e)
                                }
                            },
                            ...( value ? {value:value}:{} ),
                            ...( data && data[name] ? {value:data[name]}:{} ),
                            ...type && type != 'textarea' ? {type:type}: {},
                            ...vnode.attrs.min && vnode.attrs.max ? {min:vnode.attrs.min, max:vnode.attrs.max}: {},
                            ...vnode.attrs.minlength && vnode.attrs.maxlength ? {minlength:vnode.attrs.minlength, maxlength:vnode.attrs.maxlength}: {},
                            ...pattern ? {pattern: pattern} : {},
                            ...(vnode.attrs.id ? { id: vnode.attrs.id }: {}),
                            ...title ? {title: title} : {},
                            ...placeholder ? {placeholder: placeholder} : {},
                            disabled: disabled || false,

                            ...onkeyup ? {onkeyup: onkeyup} : {},
                            onchange:(e)=>{
                                if(onchange) onchange(e)
                            },
                        },
                    
                            
                        ),
                        
                        icon ?
                        m(SVGIcon,{
                            icon:icon, width:18, height:19, color: focused ? 'black': 'grey',
                            style: { position:'absolute', top:'50%', transform:'translateY(-50%)', left:'8px'}
                        }) : null,

                        vnode.children
                    )

                )

            ]
        }
    }
}




function DateInput(){
    let open = false;
    
    let internalValue = '';
    let segs = ['', '', '']; // [dd, mm, yyyy]
    let segRefs = [null, null, null];
    let focused = false;

    function storedToSegs(stored) {
        if (!stored) return ['', '', ''];
        let parts = stored.split('/');
        if (parts.length === 3) return [parts[2], parts[1], parts[0]]; // dd, mm, yyyy
        return ['', '', ''];
    }

    function segsToStored() {
        let [dd, mm, yyyy] = segs;
        if (!dd && !mm && !yyyy) return '';
        return `${yyyy || ''}/${mm ? String(mm).padStart(2,'0') : ''}/${dd ? String(dd).padStart(2,'0') : ''}`;
    }

    function getValue(data, name) {
        return (data && name) ? (data[name] || '') : internalValue;
    }

    function setValue(val, data, name, onchange, oninput) {
        if (data && name) data[name] = val;
        else internalValue = val;
        if (onchange) onchange(val);
        if(oninput) oninput(val)

        segs = storedToSegs(val);
        if (val) {
            let parts = val.split('/');
            if (parts[0]) viewYear = parseInt(parts[0]) || viewYear;
            if (parts[1]) viewMonth = parseInt(parts[1]) - 1;
        }
        m.redraw();
    }

    function syncSeg(idx, val, data, name, onchange) {
        segs[idx] = val;
        let stored = segsToStored();
        if (data && name) data[name] = stored;
        else internalValue = stored;
        if (onchange) onchange(stored);
    }

    return {
        view:(vnode)=>{
            let { data, name, label, required, onchange, oninput } = vnode.attrs;

            if(data && name && data[name]){
                internalValue = data[name]
            }

            return [
                m(FlexCol, { width: '100%' },
                    label ? m(FormLabel, { required }, label) : null,

                    m(Tappable, {
                        style: {
                            ...(config.form?.baseStyle),
                            ...focused && (config.form?.focusStyle || {}),
                            position: 'relative',
                            width: '100%',
                            boxSizing: 'border-box',
                        },
                        onclick:(e)=> focused = true,
                        clickout: () => {
                            focused = false;
                            if (open) { 
                                open = false; 
                                m.redraw(); 
                            }
                        },
                    },

                        m(FlexRow, { justifyContent: 'space-between', alignItems: 'center', width: '100%' },

                            m('div', { style: { flex: 1, userSelect: 'none', display: 'flex', alignItems: 'center' } },
                                m(DateSegment, {
                                    ref: (dom) => { segRefs[0] = dom; },
                                    value: segs[0], placeholder: 'dd',
                                    min: 1, max: 31, digits: 2,
                                    onvalue: (v) => syncSeg(0, v, data, name, onchange),
                                    onadvance: () => { segRefs[1]?.focus(); },
                                }),
                                m('span', { style: { color: '#aaa', padding: '0 1px' } }, '/'),
                                m(DateSegment, {
                                    ref: (dom) => { segRefs[1] = dom; },
                                    value: segs[1], placeholder: 'mm',
                                    min: 1, max: 12, digits: 2,
                                    onvalue: (v) => syncSeg(1, v, data, name, onchange),
                                    onadvance: () => { segRefs[2]?.focus(); },
                                    onretreat: () => { segRefs[0]?.focus(); },
                                }),
                                m('span', { style: { color: '#aaa', padding: '0 1px' } }, '/'),
                                m(DateSegment, {
                                    ref: (dom) => { segRefs[2] = dom; },
                                    value: segs[2], placeholder: 'aaaa',
                                    min: 1900, max: 2100, digits: 4,
                                    onvalue: (v) => syncSeg(2, v, data, name, onchange),
                                    onretreat: () => { segRefs[1]?.focus(); },
                                }),
                            ),

                            m(IconButton, {
                                icon: 'calendar',
                                color: 'rgba(34, 36, 38, 0.6)',
                                hoverColor: '#2185d0',
                                onclick: (e) => {
                                    open = !open;
                                }
                            })
                        ),

                        open ? m(Calendar, { data, name, onchange, setValue }) : null
                    )
                )
            ]
        }
    }

    function DateSegment() {
        let typingBuf = '';
        let elem = null;
        

        return {
            view: (vnode) => {
                let { value, placeholder, min, max, digits = 2, onvalue, onadvance, onretreat } = vnode.attrs;
                let active = elem ? document.activeElement === elem : false;

                return m('span', {
                    tabindex: 0,
                    style: {
                        padding: '0 3px',
                        borderRadius: '2px',
                        minWidth: digits > 2 ? '2.8em' : '1.4em',
                        textAlign: 'center',
                        display: 'inline-block',
                        outline: 'none',
                        background: active ? '#2185d0' : 'transparent',
                        color: active ? 'white' : (value ? 'inherit' : '#aaa'),
                        cursor: 'default',
                        userSelect: 'none',
                    },
                    onfocus: () => { typingBuf = ''; m.redraw(); },
                    onblur:  () => { typingBuf = ''; m.redraw(); },
                    onkeydown: (e) => {
                        let key = e.key;

                        if (key >= '0' && key <= '9') {
                            e.preventDefault();
                            typingBuf += key;

                            if (digits === 4) {
                                if (typingBuf.length === 4) {
                                    let val = String(Math.min(Math.max(parseInt(typingBuf), min), max));
                                    if (onvalue) onvalue(val);
                                    typingBuf = '';
                                    if (onadvance) onadvance();
                                }
                                m.redraw();
                            } else {
                                let num = parseInt(typingBuf);
                                if (typingBuf.length === 1 && num > Math.floor(max / 10)) {
                                    let val = String(Math.min(Math.max(num, min), max)).padStart(2, '0');
                                    if (onvalue) onvalue(val);
                                    typingBuf = '';
                                    if (onadvance) onadvance();
                                } else if (typingBuf.length === 2) {
                                    let val = String(Math.min(Math.max(parseInt(typingBuf), min), max)).padStart(2, '0');
                                    if (onvalue) onvalue(val);
                                    typingBuf = '';
                                    if (onadvance) onadvance();
                                }
                                m.redraw();
                            }

                        } else if (key === 'ArrowUp') {
                            e.preventDefault();
                            typingBuf = '';
                            let cur = parseInt(value);
                            let next = isNaN(cur) ? min : (cur + 1 > max ? min : cur + 1);
                            if (onvalue) onvalue(digits === 4 ? String(next) : String(next).padStart(2, '0'));

                        } else if (key === 'ArrowDown') {
                            e.preventDefault();
                            typingBuf = '';
                            let cur = parseInt(value);
                            let next = isNaN(cur) ? max : (cur - 1 < min ? max : cur - 1);
                            if (onvalue) onvalue(digits === 4 ? String(next) : String(next).padStart(2, '0'));

                        } else if (key === 'ArrowRight' || key === '/') {
                            e.preventDefault();
                            typingBuf = '';
                            if (onadvance) onadvance();
                            m.redraw();

                        } else if (key === 'ArrowLeft') {
                            e.preventDefault();
                            typingBuf = '';
                            if (onretreat) onretreat();
                            m.redraw();

                        } else if (key === 'Tab') {
                            typingBuf = '';
                            if (e.shiftKey) {
                                if (onretreat) { e.preventDefault(); onretreat(); }
                            } else {
                                if (onadvance) { e.preventDefault(); onadvance(); }
                            }

                        } else if (key === 'Backspace' || key === 'Delete') {
                            e.preventDefault();
                            typingBuf = '';
                            if (onvalue) onvalue('');
                        }
                    },
                }, typingBuf || value || placeholder)
            }
        }
    }


    function Calendar(){
        const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
        const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

        // rango de años visible en el picker — se extiende al hacer scroll
        let viewYear = new Date().getFullYear();
    let viewMonth = new Date().getMonth();
        let yearRangeStart = viewYear - 5;
        let yearRangeEnd   = viewYear + 5;
        let scrollElem = null;
        let calStyle = {
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: '0px',
            right: '0px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '0.5em',
            boxShadow: '0 2px 10px 0 rgba(34,36,38,.15)',
            zIndex: 1000,
            padding: '0.75em',
        };

        let showYearPicker = false;
       

        return {
            view:(vnode)=>{
                let { data, name, onchange, setValue } = vnode.attrs;
                let selectedValue = getValue(data, name);
                let selParts = selectedValue ? selectedValue.split('/') : [];
                let selYear  = selParts[0] ? parseInt(selParts[0]) : null;
                let selMonth = selParts[1] ? parseInt(selParts[1]) - 1 : null; // 0-based
                

                // ── Selector de año con scroll infinito ──
                if (showYearPicker) {
                    let years = [];
                    for (let y = yearRangeStart; y <= yearRangeEnd; y++) years.push(y);

                    return m(FlexCol, { ...calStyle, padding: '0' },

                        // cabecera
                        m(FlexRow, {
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.6em 0.75em',
                            borderBottom: '1px solid #eee',
                        },
                            m(Text, { style: { fontWeight: 'bold' } }, 'Selecciona mes y año'),
                            m(Tappable, {
                                onclick: (e) => { e.stopPropagation(); showYearPicker = false; }
                            }, m(SVGIcon, { icon: 'close', color: 'grey' }))
                        ),

                        // lista scrolleable
                        m('div', {
                            oncreate: ({ dom }) => {
                                scrollElem = dom;
                                // scroll al año actual
                                let idx = years.indexOf(viewYear);
                                if (idx >= 0) dom.scrollTop = idx * 52;
                            },
                            onscroll: (e) => {
                                let el = e.target;
                                // cargar más al llegar al borde
                                if (el.scrollTop < 60) {
                                    yearRangeStart -= 5;
                                    el.scrollTop += 5 * 52;
                                    m.redraw();
                                }
                                if (el.scrollTop + el.clientHeight > el.scrollHeight - 60) {
                                    yearRangeEnd += 5;
                                    m.redraw();
                                }
                            },
                            style: {
                                overflowY: 'auto',
                                maxHeight: '280px',
                            }
                        },
                            years.map(y => {
                                let isCurrentYear = y === viewYear;

                                return m(FlexCol, {
                                    key: y,
                                    style: {
                                        background: isCurrentYear ? '#f0f5ff' : (y % 2 === 0 ? '#f8f8f8' : '#fff'),
                                        borderBottom: '1px solid #eee',
                                    }
                                },
                                    // fila del año
                                    m(FlexRow, {
                                        alignItems: 'center',
                                        padding: '6px 0.75em 4px',
                                        gap: '0.5em',
                                    },
                                        m(Text, {
                                            style: {
                                                fontWeight: 'bold',
                                                fontSize: '0.85em',
                                                color: isCurrentYear ? '#2185d0' : '#555',
                                                minWidth: '3em',
                                            }
                                        }, String(y))
                                    ),

                                    // fila de meses
                                    m('div', {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(6, 1fr)',
                                            gap: '3px',
                                            padding: '0 0.75em 6px',
                                        }
                                    },
                                        MONTHS_SHORT.map((mon, mi) => {
                                            let isSelected = selYear === y && selMonth === mi;
                                            let isCurrent  = y === new Date().getFullYear() && mi === new Date().getMonth();

                                            return m(Tappable, {
                                                key: mi,
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '4px 2px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75em',
                                                    background: isSelected ? '#2185d0' : 'transparent',
                                                    color: isSelected ? 'white' : isCurrent ? '#2185d0' : 'inherit',
                                                    fontWeight: isCurrent || isSelected ? 'bold' : 'normal',
                                                    cursor: 'pointer',
                                                    border: isCurrent && !isSelected ? '1px solid #2185d0' : '1px solid transparent',
                                                },
                                                hover: { background: isSelected ? '#1a77c2' : '#e0e8ff' },
                                                onclick: (e) => {
                                                    e.stopPropagation();
                                                    viewYear = y;
                                                    viewMonth = mi;
                                                    showYearPicker = false;
                                                }
                                            }, mon)
                                        })
                                    )
                                )
                            })
                        )
                    )
                }

                // ── Calendario ──
                let daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                let firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

                let cells = [];
                for (let i = 0; i < firstDay; i++) cells.push(null);
                for (let d = 1; d <= daysInMonth; d++) cells.push(d);

                return m(FlexCol, calStyle,

                    m(FlexRow, { justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75em' },
                        m(Tappable, {
                            onclick: (e) => {
                                e.stopPropagation();
                                if (viewMonth === 0) { viewMonth = 11; viewYear--; }
                                else viewMonth--;
                            }
                        }, m(SVGIcon, { icon: 'chevron_left', color: 'black' })),

                        m(Tappable, {
                            onclick: (e) => { e.stopPropagation(); showYearPicker = true; }
                        }, m(Text, { style: { fontWeight: 'bold', cursor: 'pointer' } }, `${MONTHS[viewMonth]} ${viewYear}`)),

                        m(Tappable, {
                            onclick: (e) => {
                                e.stopPropagation();
                                if (viewMonth === 11) { viewMonth = 0; viewYear++; }
                                else viewMonth++;
                            }
                        }, m(SVGIcon, { icon: 'chevron_right', color: 'black' }))
                    ),

                    m('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' } },
                        DAYS.map(d => m('div', {
                            style: { textAlign: 'center', fontSize: '0.75em', fontWeight: 'bold', color: 'grey', padding: '2px 0' }
                        }, d))
                    ),

                    m('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' } },
                        cells.map((day) => {
                            if (!day) return m('div');

                            let mm = String(viewMonth + 1).padStart(2, '0');
                            let dd = String(day).padStart(2, '0');
                            let isSelected = selectedValue === `${viewYear}/${mm}/${dd}`;

                            let today = new Date();
                            let isToday = today.getFullYear() === viewYear &&
                                today.getMonth() === viewMonth &&
                                today.getDate() === day;

                            return m(Tappable, {
                                style: {
                                    textAlign: 'center',
                                    padding: '5px 2px',
                                    borderRadius: '4px',
                                    background: isSelected ? '#2185d0' : 'transparent',
                                    color: isSelected ? 'white' : isToday ? '#2185d0' : 'black',
                                    fontWeight: isToday ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    fontSize: '0.85em',
                                },
                                hover: { background: isSelected ? '#1a77c2' : '#f0f0f0' },
                                onclick: (e) => {
                                    e.stopPropagation();
                                    let val = `${viewYear}/${mm}/${dd}`;
                                    setValue(val, data, name, onchange);
                                    open = false;
                                }
                            }, day)
                        })
                    )
                )
            }
        }
    }
}


function TranslationInput(){

    let languages=['und','es','va']
    let selectedlang=0

    return {
        oninit:(vnode)=> {
            let { data, name, defaultLanguages } = vnode.attrs 

            if(defaultLanguages){
                languages = defaultLanguages.map((e)=> e.id || e)
            }

            if(vnode.attrs.initialLang){
                selectedlang = languages.findIndex((e)=> e == vnode.attrs.initialLang) || 0
            }

            if(data && name && data[name] && typeof data[name] == "object" && !data[name]?.[languages[selectedlang]]) {
                for(let i = 0; i < languages.length; i++) {
                    if(data[name]?.[languages[i]]) {
                        selectedlang = i
                        return
                    }
                }
            }

        },
        view:(vnode)=>{
            let {data, name, label, required, type, rows, info, onfocusout, onchange } = vnode.attrs

            if(!data) data = {}
            if(!name) name = 'translation'
            
            let value = data[name]

            return m(FlexCol,{width:'100%', },

                label ? m(FormLabel,{ required:required, info:info }, label) : null,

                m(FlexRow,
                    m(Input, {
                        style: { flexGrow: 2, borderRadius: ".28571429rem 0em 0em .28571429rem" },
                        rows: rows,
                        required:required,
                        data: typeof value !== "object" ? data : data[name],
                        name: typeof value !== "object" ? name : languages[selectedlang],
                        oninput: (e)=> {
                            if (!e.target.value.length && typeof value == "object") delete data[name][languages[selectedlang]]
                        },
                        type: type,
                        onfocusout: onfocusout,
                        onchange: onchange
                    }),
                    
                    m(Button,{
                        type:'default',
                        style:{
                            background:'white',
                            borderRadius:'0em .28571429rem .28571429rem 0em',
                            minWidth: "80px", border:'1px solid #22242626', 
                            flexGrow:1,  
                            fontFamily: "Poppins, Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;"
                        },
                        onclick:(e)=>{
                            if(typeof value !== "object") {
                                data[name] = { und: value }
                            }
                            else {
                                selectedlang++
                                if(selectedlang > languages.length-1) {
                                    selectedlang=0
                                }
    
                                if(vnode.attrs.changedLang) vnode.attrs.changedLang(languages[selectedlang])
                            }
                        }
                    },
                        typeof value !== "object"
                        ? m(Icon, { icon: "language", color: "gray", size: "small" })
                        : languages[selectedlang]
                    )
                ),
                
                m(FlexRow, { justifyContent: "space-between", alignItems: "center", paddingTop: "3px" }, 
                    m(FlexRow, { gap: "1rem", marginRight: "auto"}, 
                        languages.map((l, i) => {
                            if(typeof value == "object" && data[name] && data[name][l] && data[name][l].length)
                                return m(Tappable, {
                                    onclick: ()=> { selectedlang = i },
                                    style: {
                                        color: selectedlang == i ? "black" : "gray",
                                        cursor: "pointer"
                                    }
                                }, m(SmallText, l))
                        })
                    ),

                    m(FlexRow, { gap: "10px", alignItems: "center" }, [

                        // Convertir en string
                        value && value.und && Object.keys(value).length === 1
                        ? [
                            m(Tappable, {
                                onclick: ()=> {
                                    data[name] = value.und
                                }
                            },
                                m(SmallText, localize({
                                    und: "Convertir en string",
                                    en: "Convert to string",
                                    eu: "Kate bihurtu"
                                }))
                            ),

                            m("span", "|")
                        ]
                        : null,

                        // Traducir al valenciano
                        typeof value !== "object"
                        ? null 
                        : m(Icon, {
                            icon: "language",
                            color: "green",
                            size: "small",
                            onclick: async ()=> {
                                if (data[name]?.va?.length)
                                    return alert("Ya hay una traducción disponible. Por favor borra la existente antes de continuar.")
    
                                let text
                                if (typeof data[name] === "string")
                                    text = data[name]
                                else if (data[name].es)
                                    text = data[name].es
                                else
                                    text = data[name].und
                                if (!text)
                                    return alert("No hay texto que traducir")
    
                                if (confirm("¿Seguro que deseas traducir este campo al valenciano?")) {
                                    let resp = await translateSALT(text)
                                    if (resp) {
                                        if (typeof data[name] === "string") {
                                            data[name] = {
                                                und: data[name],
                                                va: resp
                                            }
                                        }
                                        else
                                            data[name].va = resp
    
                                        m.redraw()
                                    }
                                }
                            }
                        })
                    ])
                )
            )
        }
    }
}


function Dropdown(){
    
    return {
        view:(vnode)=>{
            let { data, name, label,  onchange, disabled=false, info, description, required, value, placeholder, style={}} = vnode.attrs


            return [
                m(FlexCol,{width:'100%', ...vnode.attrs.style},
                    label ? m(FormLabel,{info:info, description, required:required}, label): null,

                    m("select",{
                        disabled,
                        style: {
                            ...(config.form?.baseStyle),
                            // appearance: 'none',
                            // WebkitAppearance: 'none',
                        },
                        onchange:(e)=>{
                            data && name !=undefined ? data[name] = e.target.value: ''
                            onchange ? onchange(e.target.value) : ''
                            m.redraw()
                        }
                    },
                        m("option",{ disabled:true, selected:true }, placeholder ||  "Selecciona una opción"),

                        vnode.children.map((o)=> m("option",{
                            value: o.value != undefined ? o.value : o, 
                            selected: data && name != undefined 
                                ? typeof o == 'object' 
                                ? data[name] == o.value 
                                : data[name] == o 
                                : value
                        }, o.label || o))
                    )
                )
            ]
        }
    }
}

function RadioButtons() {
    
    return {
        view:(vnode)=>{
            let { data, name, label, onchange, disabled=false, info, description, required } = vnode.attrs


            return [
                m(FlexCol,{width:'100%', gap: "5px", ...vnode.attrs.style},

                    label ? m(FormLabel,{info:info, description, required:required}, label): null,

                    m(FlexCol, { gap: "10px" },
                        vnode.children.map((o)=> m(Tappable, {
                            style: {
                                display: "flex",
                                gap: "0.5em",
                                alignItems: "center",
                                width: "fit-content"
                            },
                            onclick: ()=> {
                                if(disabled)
                                    return

                                let value = o.value != undefined ? o.value : o

                                if(data && name)
                                    data[name] = value

                                if(onchange && typeof onchange == "function")
                                    onchange(value)
                            }
                        },

                            m(FlexRow, {
                                style: {
                                    width: "20px",
                                    height: "20px",
                                    minWidth: "20px",
                                    minHeight: "20px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "100px",
                                    border: "1px solid lightgray"
                                }
                            },
                                m(Div, { style: {
                                    background: data && name && data[name] == (o.value != undefined ? o.value : o) ? disabled ? "gray" : "#2185d0" : "white",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "100px"
                                }})
                            ),

                            m(Text, o.label || o))
                        )
                    )
                )
            ]
        }
    }
}

/*
* 
* input que solo se utiliza para fechas en formato yyyy/mm/dd
*
*/
function DateSelector() {
    
    let year = '';
    let month = '';
    let day = '';
    let focused = false;

    let writing = '';

    return {
        view: (vnode) => {
            let { data, name, label, onchange, required} = vnode.attrs

            return [
                m(FlexCol,{width:'100%'},
                    m(FormLabel,{ required }, label),

                    m(Tappable, {
                        clickout:(e)=> {
                            if(!focused) return

                            document.getElementById('date-input').blur()
                            focused = false
                            m.redraw()
                        },
                        onclick:(e)=> {
                            e.stopPropagation()
                            // how can i focus the hidden input here??
                            if(focused){
                                focused = false
                                document.getElementById('date-input').blur()
                            } else {
                                focused = true
                                document.getElementById('date-input').focus()
                            }
                        },
                        style: {
                            ...(config.form?.baseStyle),
                            ...focused && (config.form?.focusStyle || {}),
                            position: 'relative',
                            cursor: 'pointer',
                        }
                    },  
                        m(FlexRow, { justifyContent:'space-between', alignItems:'center'},
                            // hidden input 
                            m("input", {
                                style: {
                                    maxWidth: '80%',
                                    overflow:'hidden',
                                    textOverflow:'ellipsis',
                                    border:'none',
                                    outline:'none',
                                    whiteSpace:'nowrap',
                                    userSelect:'none',
                                    margin: 0,

                                    //fontSize:'1.4rem',
                                    color: data && name && data[name] ? 'black' : 'grey',
                                    //...(config.fonts?.default || config.defaultFont || {}),
                                },
                                id: 'date-input',
                                placeholder: 'aaaa/mm/dd',
                                type: 'text',
                                maxlength: 10,
                                value: (year ? `${year}${month ? '/'+ month : ''}${day ? '/'+ day : ''}` : ''),
                                oninput:(e)=>  {
                                    let val = e.target.value.replace(/[^0-9]/g, '')
                                    
                                    year = val.slice(0,4)
                                    month = val.slice(4,6)

                                    day = val.slice(6,8)

                                    if(data && name){
                                        data[name] = `${year}/${month}${day ? '/'+ day : ''}`
                                        console.log('DATA DATE', data[name])
                                    }
                                },
                                /*
                                onchange:(e)=> {
                                    if(data && name) {
                                        data[name] = `${year}/${month}/${day}`
                                    }
                                }*/
                            }), 
                            
                            year && focused ? 
                            m(SmallText, {style:{position:'absolute', bottom:'-20px', color:'grey'}} , 'aaaa/mm/dd'): null,

                            m(Icon, {
                                icon: 'calendar_today',
                                color:'rgba(34, 36, 38)'
                            })
                        ),

                        
                    )
                )
            ]
        }
    }
}



// dropdown sin utilizar el select html
function HtmlDropdown() {
    let open = false;

    let val = ''

    return {
        view: (vnode) => {
            let { data, name, label, onchange, required} = vnode.attrs


            return [
                m(FlexCol,{width:'100%'},
                    m(FormLabel,{required}, label),

                    m(Tappable, {
                        style: {
                            /*
                             ...(open 
                            ? {
                                borderBottomLeftRadius:'0em',
                                borderBottomRightRadius:'0em',
                            } : {}),*/
                            ...(config.form?.baseStyle),
                            ...open && (config.form?.focusStyle || {}),
                            position: 'relative'
                        },
                        clickout:(e)=> {
                            if(open){
                                open = false
                                m.redraw()
                            }
                        },
                        onclick:(e)=> open = !open
                    },
                        m(FlexRow, { justifyContent:'space-between', alignItems:'center', height:'100%'},
                            
                            m(Text, {
                                maxWidth:'80%',
                                overflow:'hidden',
                                textOverflow:'ellipsis',
                                whiteSpace:'nowrap',
                                color:  data && name && data[name] ? 'black' : 'grey'
                            }, 
                            val ? val : data && name && data[name] ? data[name] : 'Selecciona'),

                            // is there a built-in icon without using a library??

                            m(SVGIcon, { 
                                icon: open ? 'chevron_up' : 'chevron_down', 
                                color:'rgba(34, 36, 38)' 
                            })
                        ),

                        open ?
                        m(FlexCol, {
                            border:'1px solid #ccc',
                            borderRadius:'0.5em',
                            borderTopLeftRadius:'0em',
                            borderTopRightRadius:'0em',
                            position: 'absolute',
                            left:'0px',
                            top:'100%',
                            right: '0px',
                            boxShadow: '0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15)',
                            background:'#fff',
                            zIndex:1000,
                        }, vnode.children.map((o)=>
                            m(Tappable, {
                                style: {
                                    padding: '0.5em 1em',
                                    cursor: 'pointer',
                                    ...config.form?.dropdown?.option
                                },
                                hover: {
                                    background: '#f0f0f0'
                                },
                                onclick:(e)=>{
                                    e.preventDefault()
                                    e.stopPropagation()

                                    if(data && name != undefined) {
                                        data[name] = o.value != undefined ? o.value : o

                                        if(o.label){
                                            val = o.label
                                        }
                                    }

                                    open = !open

                                    if(onchange) onchange(o)
                                        
                                    open = false
                                }
                            }, m(Text, o.label || o))
                        ))
                        : null
                
                    )

                )

            ]
        }
    }
}


function Switch() {

    return {
        view: ({ attrs })=>{
            let { isActive, activeColor = '#47c', activeBg = '#c4d5f1', onchange, data, name, label } = attrs

            
            return m(FlexRow, {gap:'0.5em', alignItems:'center', marginTop:'0.5em'}, // tal vez se pueda quitar el margin
            
                m('div',{
                    style: {
                        background: isActive || data && name && data[name] ? activeBg : '#eee',
                        width: '60px',
                        height: '30px',
                        padding: '5px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        
                    },
                    onclick: ()=> {
                        
                        if(data && name) {
                            if(data[name] == undefined) data[name] = false
                            data[name] = !data[name]
                            isActive = data[name]
                        }


                        if(onchange && typeof onchange == "function") onchange()
                    }
                },[
                    m('input',{
                        style: { display: 'none' },
                        type: 'checkbox',
                        checked: isActive || data && name && data[name] ? true : false,
                    }),
                    m('label', {
                        style: {
                            width: '20px',
                            height: '20px',
                            background: isActive || data && name && data[name] ? activeColor : '#ccc',
                            display: 'flex',
                            cursor: 'pointer',
                            borderRadius: '50px',
                            transition: 'all 0.25s ease 0s',
                            marginLeft: isActive || data && name && data[name] ? '30px' : '0px',
                        }
                    })
                ]),

                label && m(Text, label)
            )
        }
    }
}


// input that only gets integers
function IntegerInput(){ 

    let on = false;

    return {
        view: (vnode)=>{
            let { data, name, max, min=0, label, onchange, jump=1, required, style = {} } = vnode.attrs
            
            return [
                m(FlexCol,
                    label ? m(FormLabel, {required:required}, label) : null,

                    m("div",{
                        style: {
                            ...(config.form?.baseStyle),
                            ...style
                        }
                    }, 
                        m(FlexRow,{alignItems:'center',justifyContent:'space-between'},
                            m("div",
                                data && name && data[name] ? data[name]: 0,
                                // se le puede pasar elementos dentro
                                vnode.children 
                            ),

                            m(FlexRow,
                                m(Icon,{
                                    icon:'remove',
                                    color: data[name] && data[name] > 0 && data[name]>min ? 'black' : 'lightgrey',
                                    onclick:(e)=>{
                                        if((min == undefined || data[name]>min) &&  data[name] && data[name] > 0){
                                            data[name] -= jump
                                            
                                            if(onchange) onchange(-1)
                                        }
                                    }
                                }),

                                m(Icon,{
                                    icon:'add',
                                    color: max !=undefined && (data[name] == max || max == 0) ? 'lightgrey': 'black',
                                    onclick:(e)=>{
                                        if(!data[name]) data[name] = 0

                                        console.log('MAX', max,  data[name])

                                        if(max == undefined || data[name] < max){
                                            data[name] += jump

                                            if(onchange) onchange(1)
                                        }

                                    
                                    }
                                })
                            )
                        )
                    )
                )
            ]
        }
    }
}


function HtmlIntegerInput(){ 

    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;`

    let on = false;

    return {
        view: (vnode)=>{
            let { data, name, max, min=0, label, onchange, jump=1, required } = vnode.attrs
            

            console.log('redraw', data[name], data && name && data[name])

            return [
                m(FlexCol,
                    label ? m(FormLabel, {required:required}, label) : null,


                    m("div",{style: inputStyle}, 
                        m(FlexRow,{alignItems:'center',justifyContent:'space-between'},
                            m("div",
                                data && name != undefined && data[name] != undefined ? data[name]: 0,
                                // se le puede pasar elementos dentro
                                vnode.children 
                            ),

                            m(FlexRow,{gap:'1em'},
                                m(Tappable,{
                                    icon:'remove',
                                    color: data[name] && data[name] > 0 && data[name]>min ? 'black' : 'lightgrey',
                                    onclick:(e)=>{
                                        if((min == undefined || data[name]>min) &&  data[name] && data[name] > 0){
                                            data[name] -= jump
                                            
                                            if(onchange) onchange(-1)
                                        }
                                    }
                                }, m(Text,{fontSize:'1.3rem'}, '-') ),

                                m(Tappable,{
                                    icon:'add',
                                    color: max !=undefined && (data[name] == max || max == 0) ? 'lightgrey': 'black',
                                    onclick:(e)=>{
                                        if(!data[name]) data[name] = 0

                                        if(max == undefined || data[name] < max){
                                            data[name] += Number(jump)
                                            console.log('data[name]', data[name])
                                            if(onchange) onchange(1)
                                        }
                                    }
                                }, m(Text,{fontSize:'1.3rem'}, '+'))
                            )
                        )
                    )
                )
            ]
        }
    }
}



function InfoTooltip(){
    let showingInfo

    let tooltipstyle = `pointer-events: none;
        position: absolute;
        text-transform: none;
        text-align: left;
        white-space: nowrap;
        font-size: 1rem;
        border: 1px solid #d4d4d5;
        line-height: 1.4285em;
        max-width: none;
        cursor:pointer;
        background: #fff;
        padding: .833em 1em;
        font-style: bold;
        color: rgba(0,0,0,.87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15);
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15);
        z-index: 1;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        bottom: 100%;
        margin-bottom: .5em;
    `

    return {
        view:(vnode)=>{
            let { text, inverted } = vnode.attrs

            return [

                /** ANIMACIONES SCALEIN AND OUT */
                m("style",`
                    .fadein {
                        animation: fadein 0.3s;
                    }
                    .fadeout {
                        animation: fadeout 0.3s;
                    }
                    @keyframes fadein {
                        0% { opacity:0; }
                        100% { opacity:1; }
                    }
                    @keyframes fadeout {
                        0% { opacity:1; }
                        100% { opacity:0; }
                    }
                `),

                // Cambiar esto por un icono de google  ??
                // m("i.blue.question.circle.outline.link.icon.visible", {
                //     class: showingInfo ? 'visible' : '',
                //     onmouseover:(e)=> showingInfo = true,
                //     onmouseout:(e)=> showingInfo = false,
                //     style:"margin-left:5px; position:relative",
                // },
                m(Tappable, {
                    onhover: (hovering)=> { showingInfo = hovering },
                    style: {
                        marginLeft:"5px",
                        marginBottom:"5px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative"
                    }
                },
                    m(SVGIcon, {
                        icon: "info",
                        color: "#2185d0",
                        width: 16,
                        height: 16,
                    }),

                    m("div",{
                        class: showingInfo ? 'fadein' : showingInfo != undefined ? 'fadeout':'',
                        style: showingInfo == undefined || !showingInfo ? 'display:none' :
                               tooltipstyle + (inverted ? 'background:#000000de; color:white;' : ''),
                        onmouseover:(e)=> showingInfo = true,
                        onmouseout:(e)=> showingInfo = false,
                    },  m.trust(text || vnode.children))
                )
            ]
        }
    }
}
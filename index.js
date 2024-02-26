
async function obtenerDatos() {
    let respuesta = await fetch("https://anyelec.pythonanywhere.com/api/v1/mantenimiento_vias");
    const datos = await respuesta.json();
    return datos;
}

async function cargarDatos(datos) {
    const lista = document.getElementById("lista");
    let html = "";
    for (let mantenimiento of datos) {
        const titulo= mantenimiento.tipo.toLowerCase().replace("mantenimiento","").trim();
        const tituloCapitalizado = titulo.charAt(0).toUpperCase() + titulo.slice(1);
        html += `
            <article class="information card">
                <h2 class="title">${mantenimiento.tipo}</h2>
                <p class="info"><img src="map.svg" heigth="1em">  ${mantenimiento.ubicacion}</p>
                <dl class="details">
                    <div>
                        <dt>Inicio</dt>
                        <dd>${mantenimiento.inicio}</dd>
                    </div>
                    <div>
                        <dt>Fin</dt>
                        <dd>${mantenimiento.fin}</dd>
                    </div>
                </dl>
            </article>
        `;
    }
    lista.innerHTML = html;
}
async function main(){
    const datos = await obtenerDatos();
    for (let mantenimiento of datos ){
        const titulo=mantenimiento.tipo.toLowerCase().replace("mantenimiento","").trim();
        mantenimiento.tipo=titulo.charAt(0).toUpperCase() + titulo.slice(1);
        mantenimiento.inicio=mantenimiento.inicio.split("-").join(" /").trim();
        mantenimiento.fin =mantenimiento.fin.split("-").join(" /").trim();
    }
    let copiaDatos= datos.slice();
    
    await cargarDatos(datos);
    let buscar=document.getElementById("buscar");
    buscar.addEventListener("input", 
    async function() {
        let valorBuscado=this.value;
        valorBuscado= valorBuscado.trim();
        if(valorBuscado==""){
            await cargarDatos(datos);
            copiaDatos= datos.slice();
            return;
        }
        copiaDatos.sort((a,b)=>{
            const simConA= stringSimilarity.compareTwoStrings(valorBuscado,a.tipo);
            const simConB= stringSimilarity.compareTwoStrings(valorBuscado,b.tipo);
            
            return simConB -simConA;
        });
        await cargarDatos(copiaDatos);
        
    })
    
    
}
main();

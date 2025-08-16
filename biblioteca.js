const form = document.getElementById("formArchivo");
const buscar = document.getElementById("buscar");
const listaArchivos = document.getElementById("listaArchivos");

// Cargar archivos desde servidor
function cargarArchivos(filtro = "") {
  fetch('upload.php?accion=listar')
    .then(res => res.json())
    .then(archivos => {
      listaArchivos.innerHTML = "";
      archivos
        .filter(a => a.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(archivo => {
          const div = document.createElement("div");
          div.classList.add("archivo");
          div.innerHTML = `
            <span>${archivo.nombre}</span>
            <a href="archivos/${archivo.archivo}" download>📥 Descargar</a>
          `;
          listaArchivos.appendChild(div);
        });
    });
}

// Subir archivo
form.addEventListener("submit", function(e){
  e.preventDefault();
  const nombreArchivo = document.getElementById("nombreArchivo").value;
  const archivoInput = document.getElementById("archivo").files[0];
  if(!archivoInput) return alert("Selecciona un archivo");

  const formData = new FormData();
  formData.append("archivo", archivoInput);
  formData.append("nombreArchivo", nombreArchivo);
  formData.append("accion", "subir");

  fetch("upload.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if(data.ok){
      cargarArchivos();
      form.reset();
    } else {
      alert("Error al subir archivo");
    }
  });
});

// Buscar en tiempo real
buscar.addEventListener("input", function(){
  cargarArchivos(this.value);
});

// Cargar archivos al inicio
cargarArchivos();

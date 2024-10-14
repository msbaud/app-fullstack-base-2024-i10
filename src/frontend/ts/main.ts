/**
 * Clase principal de la aplicación
 */
class Main implements EventListenerObject {
  constructor() {
    let btn = this.recuperarElemento("btnAgregar");
    btn.addEventListener("click", this);
    let btnBuscar = this.recuperarElemento("btnBuscar");
    btnBuscar.addEventListener("click", this);
    let linkAyuda = this.recuperarElemento("linkAyuda");
    linkAyuda.addEventListener("click", this);
    this.buscarDevices();
  }

  /** Maneja los eventos de la página */
  handleEvent(object: Event): void {
    let idDelElemento = (<HTMLElement>object.target).id;
    if (idDelElemento == "btnAgregar") {
      this.abrirAgregarModal();
    } else if (idDelElemento === "btnBuscar") {
      console.log("Buscando!");
      this.buscarDevices();
    } else if (idDelElemento === "linkAyuda") {
      this.abrirAyudaModal();
    } else {
      let input = <HTMLInputElement>object.target;
      let prenderJson = {
        id: input.getAttribute("idBd"),
        status: input.checked,
      };
      let xmlHttpPost = new XMLHttpRequest();

      xmlHttpPost.onreadystatechange = () => {
        if (xmlHttpPost.readyState === 4 && xmlHttpPost.status === 200) {
          let json = JSON.parse(xmlHttpPost.responseText);
          console.log(json);
        }
      };

      xmlHttpPost.open("POST", "http://localhost:8000/device", true);
      xmlHttpPost.setRequestHeader("Content-Type", "application/json");
      xmlHttpPost.send(JSON.stringify(prenderJson));
    }
  }

  /** Abre el modal de ayuda */
  abrirAyudaModal(): void {
    let helpModal = this.recuperarElemento("help-modal");
    helpModal.style.display = "block";
    let closeHelpModal = this.recuperarElemento("close-help-modal");
    closeHelpModal.addEventListener("click", () => {
      helpModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target === helpModal) {
        helpModal.style.display = "none";
      }
    });
  }

  /** Busca los dispositivos en la base de datos y los muestra en el DOM */
  private buscarDevices(): void {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          let ul = this.recuperarElemento("list");
          let listaDevices: string = "";

          let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

          for (let item of lista) {
            listaDevices += `
              <div class="device-card">
                <div class="device-header">
                  <img src="./static/images/lightbulb.png" alt="" class="device-icon">
                  <i class="material-icons edit-icon" data-id="${item.id}" style="cursor: pointer;">edit</i>
                </div>
                <div class="device-body">
                  <h5>${item.name}</h5>
                  <p>${item.description}</p>
                  <div class="switch">
                    <label>
                      Off`;
            if (item.state) {
              listaDevices += `<input idBd="${item.id}" id="cb_${item.id}" type="checkbox" checked>`;
            } else {
              listaDevices += `<input idBd="${item.id}" name="chk" id="cb_${item.id}" type="checkbox">`;
            }
            listaDevices += `
                      <span class="lever"></span>
                      On
                    </label>
                  </div>
                </div>
              </div>`;
          }

          ul.innerHTML = listaDevices;

          for (let item of lista) {
            let cb = this.recuperarElemento("cb_" + item.id);
            cb.addEventListener("click", this);

            let iconoEditar = document.querySelector(
              `.edit-icon[data-id="${item.id}"]`
            );
            if (iconoEditar) {
              iconoEditar.addEventListener("click", (event) => {
                this.abrirEditModal(item);
              });
            }
          }
        } else {
          alert("ERROR en la consulta");
        }
      }
    };

    xmlHttp.open("GET", "http://localhost:8000/devices", true);
    xmlHttp.send();
  }

  /** Abre el modal para agregar un dispositivo */
  private abrirAgregarModal(): void {
    const modal = document.getElementById("editar-modal") as HTMLDivElement;
    const nameInput = document.getElementById(
      "editar-nombre"
    ) as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "editar-descripcion"
    ) as HTMLInputElement;
    const typeInput = document.getElementById(
      "editar-tipo"
    ) as HTMLInputElement;
    const saveButton = document.getElementById(
      "boton-guardar"
    ) as HTMLButtonElement;
    const cancelButton = document.getElementById(
      "boton-cancelar"
    ) as HTMLButtonElement;
    const deleteButton = document.getElementById(
      "boton-borrar"
    ) as HTMLButtonElement;

    // Clear the input fields
    nameInput.value = "";
    descriptionInput.value = "";
    typeInput.value = "";
    deleteButton.style.display = "none";

    saveButton.onclick = () => {
      const newDevice = {
        name: nameInput.value,
        description: descriptionInput.value,
        type: parseInt(typeInput.value, 10),
        state: false,
      };
      this.agregarDevice(newDevice);
      modal.style.display = "none";
    };

    cancelButton.onclick = () => {
      modal.style.display = "none";
    };

    modal.style.display = "block";
  }

  /** Agrega un dispositivo a la base de datos. Al finalizar actualiza la lista de dispositivos */
  private agregarDevice(device: any): void {
    fetch("http://localhost:8000/device/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    })
      .then((response) => {
        if (response.ok) {
          alert("Dispositivo agregado correctamente");
          this.buscarDevices();
        } else {
          alert("Error al agregar el dispositivo");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al agregar el dispositivo");
      });
  }

  /** Abre el modal para editar un dispositivo y lo graba en la base de datos*/
  private abrirEditModal(device: any): void {
    const modal = document.getElementById("editar-modal") as HTMLDivElement;
    const nameInput = document.getElementById(
      "editar-nombre"
    ) as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "editar-descripcion"
    ) as HTMLInputElement;
    const typeInput = document.getElementById(
      "editar-tipo"
    ) as HTMLInputElement;
    const botonGuardar = document.getElementById(
      "boton-guardar"
    ) as HTMLButtonElement;
    const botonCancelar = document.getElementById(
      "boton-cancelar"
    ) as HTMLButtonElement;
    const botonBorrar = document.getElementById(
      "boton-borrar"
    ) as HTMLButtonElement;

    nameInput.value = device.name;
    descriptionInput.value = device.description;
    typeInput.value = device.type.toString();
    botonBorrar.style.display = "block";

    botonGuardar.onclick = () => {
      device.name = nameInput.value;
      device.description = nameInput.value;
      device.type = parseInt(typeInput.value, 10);
      this.actualizarDevice(device);
      modal.style.display = "none";
    };

    botonCancelar.onclick = () => {
      modal.style.display = "none";
    };

    botonBorrar.onclick = () => {
      if (confirm("Desea eliminar este dispositivo?")) {
        this.borrarDevice(device.id);
        modal.style.display = "none";
      }
    };

    modal.style.display = "block";
  }

  /** Actualiza un dispositivo en la base de datos. Al finalizar actualiza la lista de dispositivos */
  private actualizarDevice(device: any): void {
    fetch(`http://localhost:8000/device/${device.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Dispositivo actualizado correctamente");
          this.buscarDevices();
        } else {
          alert("Error al actualizar el dispositivo");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al actualizar el dispositivo");
      });
  }

  /** Borra un dispositivo de la base de datos */
  private borrarDevice(deviceId: number): void {
    fetch(`http://localhost:8000/device/${deviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Dispositivo eliminado correctamente");
          // Elimina el dispositivo del DOM
          let deviceElement = document
            .querySelector(`.edit-icon[data-id="${deviceId}"]`)
            .closest("li");
          if (deviceElement) {
            deviceElement.remove();
          }
        } else {
          alert("Error al eliminar el dispositivo");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al eliminar el dispositivo");
      });
  }

  /** Recupera un elemento del DOM */
  private recuperarElemento(id: string): HTMLInputElement {
    return <HTMLInputElement>document.getElementById(id);
  }
}

window.addEventListener("load", () => {
  let main: Main = new Main();
});

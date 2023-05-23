//SELECTORS
const presupuestoDiv = document.querySelector("#total");
const restanteDiv = document.querySelector("#restante");
const gastoDiv = document.querySelector("#agregar-gasto");
const listadoGastos = document.querySelector("#gastos");

let sp2 = document.querySelector(".form-group");

//LISTENERS
listeners();
function listeners() {
  gastoDiv.addEventListener("submit", validarGasto);

  document.addEventListener("DOMContentLoaded", promptFunction);
}

class Presupuesto {
  constructor(presupuesto) {
    this.Presupuesto = presupuesto;
    this.Restante = restante;
    this.Gasto = []; //Aqui se va estar guardando la entrada
  }
  //Metodo para usar el objeto gasto List y pasar la info al array Gasto
  newGasto(gastoList) {
    //SpreadOperator toma una copia de Gasto, y le agrega al final gastoList
    this.Gasto = [...this.Gasto, gastoList];
    console.log(this.Gasto);
    //Mandar llamar el metodo de obtener el gasto total dentro del metodo que va guardando el array de los gastos
    this.getGastoTotal();
  }
  //Metodo para ir sumando el total del gasto
  getGastoTotal() {
    const gastoTotal = this.Gasto.reduce(
      (acc, cantidadGasto) => acc + cantidadGasto.cantidadGasto,
      0
    );
    //Al gasto total restarle el presupuesto para mostrar lo que va quedando
    this.Restante = this.Presupuesto - gastoTotal;
  }
  borrarGasto(id) {
    const gastoEliminado = this.Gasto.filter((elem) => elem.id !== id);
    this.Gasto = [...gastoEliminado];
    console.log(this.Gasto);
    this.getGastoTotal();
  }
}
//UI CLASS no requiere constructor porque va ir imprimiendo mediente metodos HTML que vengal de la clase presupuesto

class UI {
  //Pasar el objeto de presupuesto a un metodo donde se muestre en el HTML
  mostrarHTML(cantidad) {
    const { Presupuesto } = cantidad;
    presupuestoDiv.textContent = Presupuesto;
    //document.querySelector("#total").textContent = Presupuesto  => Otra manera de pasarlo directamente sin hacer el selector
    restanteDiv.textContent = Presupuesto;
  }

  showAlert(mensaje, tipo) {
    const div = document.createElement("DIV");
    div.classList.add("alert", "text-center");

    if (tipo === "error") {
      div.classList.add("alert-danger");
    } else {
      div.classList.add("alert-success");
    }

    div.textContent = mensaje;
    gastoDiv.insertBefore(div, sp2);
    setTimeout(() => {
      div.remove();
    }, 2000);
  }

  showGastoList(Gasto) {
    this.limpiarHTML();
    Gasto.forEach((elem) => {
      //Aplicar el destructuring dentro del forEach
      const { nombreGasto, cantidadGasto, id } = elem;
      const li = document.createElement("li");
      //className = se asigna un valor diferente, asi porque el li va a tener muchas clases
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      //Agregando el atributo id que va ser igual al id destructurado
      //li.setAttribute("data-id" id)=> Asi se hacia anteriormente
      li.dataset.id = id;
      //insertar el gasto
      li.innerHTML = ` ${nombreGasto}<span class = "badge badge-primary badge-pill"> $ ${cantidadGasto}</span>`;
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnEliminar.textContent = "X";
      //Agregar el evento onclick llamar a la funcion removeTweet y pasar como parametro el id
      btnEliminar.onclick = () => {
        borrarGasto(id);
      };

      li.appendChild(btnEliminar);
      listadoGastos.appendChild(li);
    });
  }
  limpiarHTML() {
    //listaTewwts.innerHTML = "";
    // Otra manera de limpiar el HTML es con un While
    while (listadoGastos.firstChild) {
      listadoGastos.removeChild(listadoGastos.firstChild);
    }
  }

  showGastoTotal(Restante) {
    restanteDiv.textContent = Restante;
  }
  //Crear el metodo cde comprobarPrespuesto donde destructuraremos el resante y el presupuesto
  //COMPROBAR "25%" => Una vez que solo quede el 25 % se debe cambiar de color la etiqueta
  // entre 4 = 25 => si este es mayor al restante entonces ya se gasto mas del 75%
  //COMPROBAR que se  ha gastado mas de la mitad. doividir el presupuesto entre 2=> si es mayor al restante
  comprobarPresupuesto(presupuesto) {
    let restanteClass = document.querySelector(".restante");
    const { Presupuesto, Restante } = presupuesto;
    if (Presupuesto / 4 >= Restante) {
      console.log("gastaste el 75%");
      restanteClass.classList.remove("alert-success", "alert-warning");
      restanteClass.classList.add("alert-danger");
    } else if (Presupuesto / 2 >= Restante) {
      console.log("Vas a la mitad de tu presupuesto");
      restanteClass.classList.remove("alert-success");
      restanteClass.classList.add("alert-warning");
    } else {
      restanteClass.classList.remove("alert-danger", "alert-warning");
      restanteClass.classList.add("alert-success");
    }
    if (Restante <= 0) {
      console.log("Tu dinero se acabo ");
      ui.showAlert("Tu dinero se acabo ", "error");
      gastoDiv.querySelector("button[type=submit]").disabled = true;
    }
  }
}

//INSTANCIANDO UI
const ui = new UI();
let presupuesto;

//FUNCIONES
//Prompt
function promptFunction() {
  let entradaPresupuesto = prompt("Cual es tu presupuesto?");
  while (
    entradaPresupuesto == null ||
    /\D/.test(entradaPresupuesto) ||
    entradaPresupuesto == ""
  ) {
    entradaPresupuesto = prompt("Entre un número VÁLIDO: ");
  }
  //console.log(entradaPresupuesto);

  //INSTANCIANDO Presupuesto
  presupuesto = new Presupuesto(entradaPresupuesto);
  console.log(presupuesto);
  //Usando la instancia de UI para pasarle el objeto de presupuesto y poder usarlo en el metodo mostrarHTML
  ui.mostrarHTML(presupuesto);
}

function validarGasto(e) {
  e.preventDefault();
  const nombreGasto = document.querySelector("#gasto").value;
  //Recibir el valor en numero en vez de string
  const cantidadGasto = Number(document.querySelector("#cantidad").value);
  if (nombreGasto === "" || cantidadGasto === "") {
    ui.showAlert("Se detecto un campo vacio, intenta de nuevo", "error");
    return;
  } else if (cantidadGasto <= 0 || isNaN(cantidadGasto)) {
    ui.showAlert("Cantidad no Valida", "error");
    return;
  }
  ui.showAlert("Verificado", "correcto");
  //Object literal enhancement .- (Es lo contrario al destructuring: une nombre y cantidad a gastoList)
  //Crear un objeto para almacenar la informacion de entrada del concepto y el gasto
  //Que despues se usará para despleglarse en un listado
  //Date.now para agregar un id con un numero especifico (id es el key; el valor es el numero que arroja date.now)
  const gastoList = { nombreGasto, cantidadGasto, id: Date.now() };
  //Usando la instnacia presupuesto para pasarle el objeto de gastoList y poder usarlo en el metodo gasto
  //Añadir un nuevo gasto al objeto de presupuesto
  presupuesto.newGasto(gastoList);

  presupuesto.getGastoTotal(gastoList);

  //Pasar el objeto presupuesto para imprimir los gastos
  //Aplicar destructuring para sacar los gastos para no pasar el objeto completo
  const { Gasto, Restante } = presupuesto;
  //Usando la instancia de UI para pasarle el objeto presupuesto y poder usarlo en los metodos mencionados
  ui.showGastoTotal(Restante);
  ui.showGastoList(Gasto);
  //Se pasa todo el objeto porque se necesitan el restante y el presupuesto inicial
  ui.comprobarPresupuesto(presupuesto);
  console.log(Gasto);
  //REinicia el formulario
  gastoDiv.reset();
}

function borrarGasto(id) {
  //ELimina los gastos del objeto
  presupuesto.borrarGasto(id);
  //Elimina los gastos del HTML
  const { Gasto, Restante } = presupuesto;
  ui.showGastoList(Gasto);
  ui.showGastoTotal(Restante);
  ui.comprobarPresupuesto(presupuesto);
}

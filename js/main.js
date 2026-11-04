// --- tab ---
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Attiva il tab di default se l'elemento esiste
if (document.getElementById("defaultOpen")) {
  document.getElementById("defaultOpen").click();
}

// --- Accordion ---
var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

// --- magnifier ---
function magnify(imgID, zoom) {
  var img, glass, w, h, bw;
  img = document.getElementById(imgID);
  if (!img) return; // Se l'immagine non è presente in questa pagina, esce senza errori

  // Crea l'elemento della lente
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");
  
  // Inserisce la lente nel DOM sopra l'immagine
  img.parentElement.insertBefore(glass, img);

  // Imposta lo sfondo della lente con l'immagine originale
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
  bw = 3;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;

  // Gestione degli eventi di movimento del mouse e touch
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);

  function moveMagnifier(e) {
    var pos, x, y;
    e.preventDefault();
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    
    // Limiti per non far uscire la lente dall'immagine
    if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
    if (x < w / zoom) {x = w / zoom;}
    if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
    if (y < h / zoom) {y = h / zoom;}
    
    glass.style.left = (x - w) + "px";
    glass.style.top = (y - h) + "px";
    glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
  }

function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    a = img.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}


// Attiva il magnifier con fattore di zoom pari a 3 quando la pagina dell'item è caricata
window.addEventListener('load', function() {
  if (document.getElementById("itemImage")) {
    magnify("itemImage", 3);
  }
});

// --- ordinamento tabella dati ---
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("datasetTable");
  if (!table) return; // Se la tabella non è in questa pagina, esce senza errori
  
  switching = true;
  dir = "asc"; 

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      var xVal = x.textContent || x.innerText;
      var yVal = y.textContent || y.innerText;
      
      // Controllo specifico per la colonna ID
            if (n === 0) {
        xVal = parseInt(xVal);
        yVal = parseInt(yVal);
        if (dir == "asc") {
          if (xVal > yVal) { shouldSwitch = true; break; }
        } else if (dir == "desc") {
          if (xVal < yVal) { shouldSwitch = true; break; }
        }
      } else {
        // Ordinamento alfabetico per le altre colonne
        if (dir == "asc") {
          if (xVal.toLowerCase() > yVal.toLowerCase()) { shouldSwitch = true; break; }
        } else if (dir == "desc") {
          if (xVal.toLowerCase() < yVal.toLowerCase()) { shouldSwitch = true; break; }
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount === 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
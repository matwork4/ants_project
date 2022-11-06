/* Fonctions qui modifient le DOM html
*/

function displayTerrain(){
	let terrain = document.createElement("table");
	terrain.setAttribute('id',"childTerrain");

		for(let i=0; i<dimY-1; i++){
			let ligne = document.createElement("tr");
			for(let j=0; j<dimX-1; j++){
				let col = document.createElement("td");
				//col.innerHTML = "0";

				//console.log("T.tab["+i+"]["+j+"].isWall = "+T.tab[i][j].isWall);
				if(T.tab[i][j].isWall){
					col.setAttribute('class', "wall");
				}else if(T.tab[i][j].isFood){
					col.setAttribute('class', "food");
				}else if(T.tab[i][j].isNest){
					col.setAttribute('class', "nest");
				}else{
					col.setAttribute('class', "empty");
				}

				col.setAttribute('id', 'block'+T.tab[i][j].id);
				col.setAttribute('onclick','addOrRemoveWall('+T.tab[i][j].id+')');

				ligne.appendChild(col);
			}
			terrain.appendChild(ligne);
		}

		document.getElementById("terrain").appendChild(terrain);
}

function deleteTerrain(){
	document.getElementById("childTerrain").remove();
}

function playOrStop(b){
	let elemPlay = document.getElementById("play");
	let elemStop = document.getElementById("stop");

	if(b){
		elemPlay.style.background = "lightgreen";
		elemStop.style.background = "white";
	}else{
		elemPlay.style.background = "white";
		elemStop.style.background = "lightcoral";
	}
}

function restartDOM(){
	let elemPlay = document.getElementById("play");
	let elemStop = document.getElementById("stop");

	elemPlay.style.background = "white";
	elemStop.style.background = "white";
}

/* Update la couleur des phéromones sur un bloc
*/
function updateBlockDOM(id){

	let b = T.searchBlockById(id);
	let redValue = (b.redPheromones / maxPheromones)*255;
	let greenValue = (b.greenPheromones / maxPheromones)*255;
	//Pour définir l'opacité (et éviter les cases noires)
	let o;
	if(b.redPheromones > b.greenPheromones){
		o = b.redPheromones;
	}else{
		o = b.greenPheromones;
	}
	let opacity = o/maxPheromones

	let elemBlock = document.getElementById("block"+id);
	elemBlock.style.background = "rgba("+redValue+","+greenValue+", 0,"+opacity+")"


}

function updateFoodCollectedDOM(){
	let elemFood = document.getElementById("nbFood");
	elemFood.innerText = foodCollected;
}

function updateGenerationDOM(){
	let elemGen = document.getElementById("nbGeneration");
	elemGen.innerText = generation;
}

function addOrRemoveWallDOM(id,isNewWall){
	let elemBloc = document.getElementById("block"+id);

	if(isNewWall){
		elemBloc.setAttribute('class', "wall");
		elemBloc.removeAttribute('style');
	}else{
		elemBloc.setAttribute('class', "empty");
	}
}

/* Fonction qui ajoute ou retire un mur sur le terrain
*  (uniquement si le jeu est en pause)
*/
function addOrRemoveWall(id){

  if(!run){
	let b = T.searchBlockById(id);
	if(b.isEmpty){
		b.isEmpty = false;
		b.isWall = true;
		addOrRemoveWallDOM(id,true);
	}else if(b.isWall){
		b.isEmpty = true;
		b.isWall = false;
		addOrRemoveWallDOM(id,false);
	}else{
		console.log("Invalid Wall");
	}
  }

}








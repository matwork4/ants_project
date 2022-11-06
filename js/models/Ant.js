
class Ant{

	/* 
	* x : pos X
	* y : pos Y
	* proba : probabilité de suivre un marqueur
	* isHoldingFood : false si cherche food, true si retourne home
	* isAlive : bool
	* age : int, incrémenté a chaque tick
	* direction : North, South, East, West
	*/

	constructor(x,y,p){
		this.x=x;
		this.y=y;
		this.proba=p;
		this.isHoldingFood = false;
		this.isAlive = true;
		this.age = 0;
		this.nbFoodCollected = 0;
		this.addPheromones = addPheromones;

		let rand = getRandomInt(4);
		if(rand==0){
			this.direction = "N";
		}else if(rand==1){
			this.direction = "S";
		}else if(rand==2){
			this.direction = "E";
		}else{
			this.direction = "W";
		}
	}

	die(){
		if(age>=lifeTime){
			this.isAlive = false;
		}
	}

	collectFood(){
		this.isHoldingFood = true;
	}

	dropFood(){
		this.isHoldingFood = false;
	}

}
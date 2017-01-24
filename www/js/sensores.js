var app = {
    inicio: function() {
    	DIAMETRO_BOLA = 51;
    	alto = document.documentElement.clientHeight;
    	ancho = document.documentElement.clientWidth;

    	dificultad = 0;
    	velocidadY = 0;
    	velocidadX = 0;
    	puntuacion = 0;
    	app.vigilarSensores();
    	app.iniciaJuego();        
    },
    iniciaJuego: function(){
    	function preload(){
    		game.physics.startSystem(Phaser.Physics.ARCADE);

    		game.stage.backgroundColor = "#F27D0C";
    		game.load.image("bola", "img/ball.png");
    		game.load.image("objetivo", "img/target.png");
    	}

    	function create(){
    		scoreText = game.add.text(16,16, puntuacion, {fontSize: "100px", fill: "#757676"});
    		bola = game.add.sprite(app.inicioX(), app.inicioY(), "bola");
    		objetivo = game.add.sprite(app.inicioX(), app.inicioY(), "objetivo");
    		
    		game.physics.arcade.enable(bola);
    		game.physics.arcade.enable(objetivo);

    		bola.body.collideWorldBounds = true;
    		bola.body.onWorldBounds = new Phaser.Signal();
    		bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    	}

    	function update(){
    		var factorDificultad = (300 + dificultad * 100);
    		bola.body.velocity.y = (velocidadY * factorDificultad);
    		bola.body.velocity.x = (velocidadX * -factorDificultad);

    		game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
    	}

    	var estados = {preload: preload, create: create, update: update};
    	var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, "phaser", estados);
    },
    inicioX: function(){
    	return app.numeroAleatorioHasta( ancho - DIAMETRO_BOLA);
    },
    inicioY: function(){
    	return app.numeroAleatorioHasta( alto - DIAMETRO_BOLA);
    },
    vigilarSensores: function(){
    	function onError() {
            console.log("onError!");
        }
        // navigator.accelerometer.getCurrentAcceleration(app.onSuccess, onError);
        navigator.accelerometer.watchAcceleration(app.onSuccess, onError,{ frequency: 10 });
    },
    decrementaPuntuacion: function(){
    	puntuacion --;
    	scoreText.text = puntuacion;
    },
    incrementaPuntuacion: function(){
    	puntuacion +=10;
    	scoreText.text = puntuacion;

    	objetivo.body.x = app.inicioX();
    	objetivo.body.y = app.inicioY();

    	if(puntuacion > 0){
    		dificultad++;
    	}
    },
    numeroAleatorioHasta: function(limite){
    	return Math.floor(Math.random() * limite);
    },
    registraDireccion: function(data){
    	velocidadX = data.x;
    	velocidadY = data.y;
    },
    // ///////////////////////////////////
    onSuccess: function(data) {
        app.detectaAgitacion(data);
        app.registraDireccion(data);
        // app.showValues(data);
    },
    showValues: function(data) {
        app.representa(data.x, "X");
        app.representa(data.y, "Y");
        app.representa(data.z, "Z");
    },
    representa: function(value, span) {
        var rounded = Math.round(value * 100) / 100;
        document.querySelector("#spn" + span).innerHTML = rounded;
    },
    detectaAgitacion: function(data) {
        var shakeX = data.x > 15;
        var shakeY = data.y > 15;

        if (shakeX || shakeY)
        	setTimeout(app.recomienza, 1000);
            /*document.body.className = "shake";
        else
            document.body.className = "";*/
    },
    recomienza: function(){
    	document.location.reload(true);
    }
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}

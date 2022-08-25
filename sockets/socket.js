const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Queen' ));
bands.addBand( new Band( 'Estopa' ));
bands.addBand( new Band( 'La Ludwigband' ));
bands.addBand( new Band( 'Jazz Magnetism' ));


//Mensajes de Sockets  
io.on('connection', client => {
    console.log('Cliente conectado');

    console.log(bands.getBands);

    
        client.emit('active-bands', bands.getBands());
    

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });

    });

    client.on('vote-band', (payload)=>{

        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands() );

    });

    //Escuchar add-band
    client.on('add-band', (payload)=>{

        const newBand = new Band(payload.name); 

        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands() );

    });

    //Delete band
    client.on('delete-band', (payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands() );

    });



    // client.on('emitir-mensaje', (payload) => {
    //     console.log('Mensaje:', payload);
    //      //io.emit('nuevo-mensaje', payload);  //emite a todos
    //     client.broadcast.emit('emitir -mensaje', payload);  //emite a todos menos al que emitió
        
    // } )

});
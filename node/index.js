const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
const mysql = require('mysql')


const doSelect = () => {
    
    const connection = mysql.createConnection(config)
    connection.connect((err)=>{

        if (err) throw err; 
        
        console.log('Conectado');
        
        connection.query(`
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )  ENGINE=INNODB;
        `, function (err, result) {
            if (err) throw err;
            console.log("Database created");
        });

        //connection.query(`delete from people;`, function (err, result) {
        //    if (err) throw err;
        //    console.log("Linhas excluidas!");
        //});

        connection.query(`
                INSERT INTO people (name)
                SELECT * FROM (SELECT 'Wesley' AS name) AS tmp
                WHERE NOT EXISTS (
                    SELECT name FROM people WHERE name = 'Wesley'
                ) LIMIT 1;
        `, (err, result) => {
            if (err) throw err;
            console.log("Linha inserida!");
        });

        connection.query(`
                INSERT INTO people (name)
                SELECT * FROM (SELECT 'Luciano' AS name) AS tmp
                WHERE NOT EXISTS (
                    SELECT name FROM people WHERE name = 'Luciano'
                ) LIMIT 1;
        `, function (err, result) {
            if (err) throw err;
            console.log("Linha inserida!");
        });

    }
    );

/*    const t = await connection.query(`
    CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )  ENGINE=INNODB;
    `);
    console.log(t)
    const r = await connection.query(`INSERT INTO people(name) values('Luciano');`);
    console.log(r)
    const rows = await connection.query('select * from people;');*/
    //connection.end();
    //console.log(rows)
    //return rows;
}

const peoples = doSelect();
//console.log(JSON.stringify(peoples));
//console.log('Insert executado!');



app.get('/', (req,res) => {

    //res.write('<h1>Full Cycle</h1>');
    
    const con = mysql.createConnection(config);
    con.connect(err => {
        if (err) throw err;
        con.query("SELECT id, name FROM people", function (err, result, fields) {
          if (err) throw err;
            res.write('<h1>Full Cycle Rocks!</h1>');
            result.forEach(p => { res.write(`<h3>${p.id} - ${p.name}</h3>`); })
            res.send();
        });
    });
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port);
})
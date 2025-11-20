CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE proyecto (
    id_proyecto SERIAL PRIMARY KEY,
    id_persona INT NOT NULL,
    nombre_proyecto VARCHAR(255) NOT NULL,
    presupuesto NUMERIC(10, 2) DEFAULT 0.00,
    fecha_inicio DATE,
    fecha_fin DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_persona
        FOREIGN KEY (id_persona)
        REFERENCES Persona (id)
        ON DELETE RESTRICT
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_persona_updated_at
BEFORE UPDATE ON Persona
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_proyecto_updated_at
BEFORE UPDATE ON Proyecto
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

INSERT INTO persona (nombre, cedula) VALUES ('Carlos Piña', '12345678');

CREATE VIEW vista_proyectos_por_persona AS
SELECT
    p.id,
    p.nombre,
    p.cedula,
    py.id_proyecto,
    py.nombre_proyecto,
    py.presupuesto,
    py.fecha_inicio,
    py.fecha_fin
FROM
    persona AS p
JOIN
    proyecto AS py ON p.id = py.id_persona;
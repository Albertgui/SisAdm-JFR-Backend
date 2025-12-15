CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cedula VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE proyecto (
    id_proyecto SERIAL PRIMARY KEY,
    id_persona VARCHAR(10) NOT NULL,
    nombre_proyecto VARCHAR(255) NOT NULL,
    presupuesto NUMERIC(10, 2) DEFAULT 0.00,
    fecha_inicio DATE,
    fecha_fin DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_persona
        FOREIGN KEY (id_persona)
        REFERENCES Persona (cedula)
        ON DELETE RESTRICT
);

CREATE TABLE factura (
    id SERIAL PRIMARY KEY,
    id_proyecto INTEGER NOT NULL,
    url_imagen TEXT NOT NULL,
    nombre_archivo VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_proyecto_factura
        FOREIGN KEY (id_proyecto)
        REFERENCES proyecto (id_proyecto)
        ON DELETE CASCADE
);

CREATE TABLE tm_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    pass VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
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
    proyecto AS py ON p.cedula = py.id_persona;
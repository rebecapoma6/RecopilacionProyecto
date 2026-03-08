export interface Product {
    id_registro: number;        
    created_at: string;         
    titulo: string | null;      
    resena: string | null;      
    imagen_url: string | null;  
    id: string | null;          
    tipo: string | null; 
    genero: string | null;
    autor: string | null;
    fecha_fin: Date | null;   
    puntuacion: number | null;
       
}
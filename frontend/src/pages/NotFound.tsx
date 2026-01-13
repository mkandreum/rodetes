import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-9xl font-bold text-rodetes-pink mb-4 glitch-hover" data-text="404">404</h1>
            <h2 className="text-2xl md:text-3xl font-pixel text-white mb-8">PÁGINA NO ENCONTRADA</h2>
            <p className="text-gray-400 mb-8 max-w-md">
                Ups, parece que esta drag se ha perdido por el camino. Vuelve a la pista de baile.
            </p>

            <Link to="/">
                <Button>VOLVER AL INICIO</Button>
            </Link>
        </div>
    );
};

export default NotFound;

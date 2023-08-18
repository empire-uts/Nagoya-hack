import { OrbitProgress  } from "react-loading-indicators";

/**
 * Spinner Component
 * @returns 
 */
const Spinner = () => {
    
    return (
        <div className="mt-16 text-center">
            <OrbitProgress 
                variant="dotted"
                color="#3B82F6"
                size="medium"
                text=""
                textColor=""
            />
        </div>//59 130 246
    );
};

export default Spinner;
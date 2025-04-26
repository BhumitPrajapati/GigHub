import React from 'react';
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

interface AlertComponentProps {
    variant: 'default' | 'destructive';
    title: string;
    description: string;
    onClose: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ variant, title, description, onClose }) => {
    return (
        <Alert variant={variant}>
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
                <div className='fixed top-0 right-1'>
                    <button onClick={onClose} className="ml-4 text-white hover:text-slate-600">
                        &times;
                    </button>
                </div>
            </div>
        </Alert>
    );
};

export default AlertComponent;
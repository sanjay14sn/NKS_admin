import React from 'react';
import { CheckCircle, Circle, Truck, Package } from 'lucide-react';

interface OrderTrackingProps {
  order: {
    id: string;
    customer: string;
    status: string;
    total: number;
    date: string;
  };
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const getStepStatus = (stepName: string, currentStatus: string) => {
    const statusOrder = ['Pending', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepName);
    
    if (stepIndex <= currentIndex) {
      return 'completed';
    }
    return 'pending';
  };

  const steps = [
    {
      name: 'Pending',
      description: 'Order received and being processed',
      icon: Package,
    },
    {
      name: 'Shipped',
      description: 'Order shipped and on the way',
      icon: Truck,
    },
    {
      name: 'Delivered',
      description: 'Order delivered successfully',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Customer:</span>
            <p className="font-medium">{order.customer}</p>
          </div>
          <div>
            <span className="text-gray-600">Total:</span>
            <p className="font-medium">${order.total}</p>
          </div>
          <div>
            <span className="text-gray-600">Date:</span>
            <p className="font-medium">{order.date}</p>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <p className="font-medium">{order.status}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Order Timeline</h3>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step.name, order.status);
          const isCompleted = status === 'completed';
          
          return (
            <div key={step.name} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 p-2 rounded-full ${
                isCompleted ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Icon className={`h-5 w-5 ${
                  isCompleted ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {step.name}
                </p>
                <p className="text-sm text-gray-600">{step.description}</p>
                {isCompleted && (
                  <p className="text-xs text-green-600 mt-1">Completed</p>
                )}
              </div>
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
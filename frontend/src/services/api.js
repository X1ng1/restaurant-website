const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate or retrieve session ID
const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

// Menu API
export const menuAPI = {
    // Get all menu items
    getAll: async () => {
        const response = await fetch(`${API_URL}/menu`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Get menu by category
    getByCategory: async (category) => {
        const response = await fetch(`${API_URL}/menu/category/${category}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
};

// Cart API
export const cartAPI = {
    // Get cart
    getCart: async () => {
        const response = await fetch(`${API_URL}/cart`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Add item to cart
    addItem: async (name, price, quantity = 1) => {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, quantity })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Update item quantity
    updateItem: async (itemName, quantity) => {
        const response = await fetch(`${API_URL}/cart/${encodeURIComponent(itemName)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Remove item from cart
    removeItem: async (itemName) => {
        const response = await fetch(`${API_URL}/cart/${encodeURIComponent(itemName)}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Clear cart
    clearCart: async () => {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
};

// Order API
export const orderAPI = {
    // Create order
    createOrder: async (customerInfo = {}) => {
        const sessionId = getSessionId();
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, customerInfo })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Get order by order number
    getOrderByNumber: async (orderNumber) => {
        const response = await fetch(`${API_URL}/orders/number/${orderNumber}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Get user's orders
    getMyOrders: async () => {
        const sessionId = getSessionId();
        const response = await fetch(`${API_URL}/orders/session/${sessionId}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    // Cancel order
    cancelOrder: async (orderNumber) => {
        const response = await fetch(`${API_URL}/orders/cancel/${orderNumber}`, {
            method: 'PUT'
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
};

export { getSessionId };

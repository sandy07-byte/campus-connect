import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useRealtimeData = (endpoint, namespace, token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const namespaceRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/realtime${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
          namespaceRef.current = result.namespace;
          
          // Connect to Socket.IO for real-time updates
          if (!socketRef.current) {
            socketRef.current = io('http://localhost:4000', {
              auth: { token }
            });

            socketRef.current.on('connect', () => {
              console.log('Connected to Socket.IO');
              setIsConnected(true);
              
              // Join the specific namespace
              if (namespaceRef.current) {
                socketRef.current.emit('join-namespace', namespaceRef.current);
              }
            });

            socketRef.current.on('disconnect', () => {
              console.log('Disconnected from Socket.IO');
              setIsConnected(false);
            });

            socketRef.current.on('dataChange', (changeData) => {
              console.log('Real-time data change:', changeData);
              
              // Update the data based on the change
              setData(prevData => {
                if (!prevData) return prevData;
                
                // Handle different types of changes
                switch (changeData.operation) {
                  case 'insert':
                    return handleInsert(prevData, changeData);
                  case 'update':
                    return handleUpdate(prevData, changeData);
                  case 'delete':
                    return handleDelete(prevData, changeData);
                  default:
                    // For other operations, refetch the data
                    fetchInitialData();
                    return prevData;
                }
              });
            });

            socketRef.current.on('error', (error) => {
              console.error('Socket.IO error:', error);
              setError(error);
            });
          }
        } else {
          throw new Error(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInitialData();
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [endpoint, token]);

  // Helper functions to handle different types of data changes
  const handleInsert = (prevData, changeData) => {
    const newItem = changeData.data;
    const collection = changeData.collection;
    
    // Update the appropriate collection in the data
    if (prevData[collection]) {
      return {
        ...prevData,
        [collection]: {
          ...prevData[collection],
          list: [newItem, ...prevData[collection].list],
          total: prevData[collection].total + 1
        }
      };
    }
    
    return prevData;
  };

  const handleUpdate = (prevData, changeData) => {
    const updatedItem = changeData.data;
    const collection = changeData.collection;
    
    if (prevData[collection]) {
      return {
        ...prevData,
        [collection]: {
          ...prevData[collection],
          list: prevData[collection].list.map(item => 
            item._id === updatedItem._id ? updatedItem : item
          )
        }
      };
    }
    
    return prevData;
  };

  const handleDelete = (prevData, changeData) => {
    const deletedId = changeData.data._id;
    const collection = changeData.collection;
    
    if (prevData[collection]) {
      return {
        ...prevData,
        [collection]: {
          ...prevData[collection],
          list: prevData[collection].list.filter(item => item._id !== deletedId),
          total: Math.max(0, prevData[collection].total - 1)
        }
      };
    }
    
    return prevData;
  };

  const disconnect = async () => {
    if (socketRef.current && namespaceRef.current) {
      try {
        await fetch('http://localhost:4000/api/realtime/disconnect', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ namespace: namespaceRef.current })
        });
      } catch (err) {
        console.error('Error disconnecting:', err);
      }
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return {
    data,
    loading,
    error,
    isConnected,
    disconnect,
    refetch: () => {
      setLoading(true);
      // Trigger a refetch by updating the token dependency
      setData(null);
    }
  };
};

export default useRealtimeData;





// write a README file for a project, which basically helps in managing ads in different platforms from a single place

# Ad Manager

Ad Manager is a tool that helps in managing ads in different platforms from a single place.

## Features

#### Facebook Ads

- Create campaigns
- Create ad sets
- Create ads
- View reports

#### Google Ads


        this.in = in ;
        this.username = username;
    }
    @override
    public void run() {
        try {
            string message;
            while ((message = in .readline()) != null) {
                broadcastmessage(username + ": " + message);
            }
        } catch (ioexception e) {
            // handle client disconnection  
            clients.remove(username);
            broadcastmessage("[server] " +
                username + " has left the chat.");
        } finally {
            try {
                clientsocket.close();
            } catch (ioexception e) {
                // handle socket closing exception   }  
            }
        }
    }
    public static void main(string[] args) throws ioexception {
        chatserver server = new chatserver(12345);
        server.start();
    }
}


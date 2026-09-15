import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService} from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() wss!: Server;
  constructor(private readonly messagesWsService: MessagesWsService) {}


  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    this.messagesWsService.registerClient(client);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


  @SubscribeMessage('message-from-client')
  onMessageFromClient(client:Socket, payload: NewMessageDto){

    //!Emite a un cliente
    /*client.emit('message-from-server',{
      fullName: 'Yo',
      message:payload.message || 'no-message'
    });

    //!Emite a todos menos al cliente inicial
    client.broadcast.emit('message-from-server',{
      fullName: 'Yo',
      message:payload.message || 'no-message'
    });*/

    //para todos
    this.wss.emit('message-from-server',{
      fullName: 'Yo',
      message:payload.message || 'no-message'
    });
  }

}

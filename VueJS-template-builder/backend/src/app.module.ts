import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplatesModule } from './templates/templates.module';
import { FormsModule } from './forms/forms.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/template-builder',
        ),
      }),
      inject: [ConfigService],
    }),
    TemplatesModule,
    FormsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  
  onModuleInit() {
    // 1 = connected in mongoose connection states
    console.log(
      'MongoDB connection status:',
      this.connection.readyState === 1 ? 'Connected' : 'Not connected',
    );
    
    this.connection.on('connected', () => {
      console.log('MongoDB database connection established successfully');
    });
    
    this.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    this.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  }
}

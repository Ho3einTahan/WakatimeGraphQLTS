import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ProjectModule } from './modules/project/project.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EditorModule } from './modules/editor/editor.module';
import { TeamModule } from './modules/team/team.module';
import { GoalModule } from './modules/goal/goal.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UnitAmountScalar } from './custom-scalars/UnitAmountScalar';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { User } from './modules/user/user.model';
// import { Group } from './object_types/group';

@Module({
  imports: [
    AuthModule,
    UserModule,
    NotificationModule,
    AnalyticsModule,
    ProjectModule,
    PrismaModule,
    EditorModule,
    TeamModule,
    GoalModule,
    LeaderboardsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      dest: './uploads', // Specify the destination folder
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ req }),
    }),
    // UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import passport from 'passport'
import { AuthenticationError } from '../../infrastructure/error/AuthenticationError'

dotenv.config()

export class PassportConfig {
  constructor(private readonly userRepo: IUserRepository) {
    this.initializeLocalStrategy()
    this.initializeJwtStrategy()
  }

  private initializeLocalStrategy(): void {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true,
        },
        (req, email, password, done) => {
          const errorMessage = 'Email or password is incorrect.'

          this.userRepo
            .findByEmail(email)
            .then((user) => {
              if (user == null) {
                const error = new AuthenticationError(errorMessage)
                done(error)
                return
              }

              bcrypt
                .compare(password, user.hashedPassword)
                .then((res) => {
                  if (!res) {
                    const error = new AuthenticationError(errorMessage)
                    done(error)
                    return
                  }
                  done(null, user)
                })
                .catch((err) => {
                  done(new AuthenticationError(errorMessage, err))
                })
            })
            .catch((err) => {
              done(new AuthenticationError(errorMessage, err))
            })
        }
      )
    )
  }

  private initializeJwtStrategy(): void {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    }
    passport.use(
      new JWTStrategy(jwtOptions, (jwtPayload, done) => {
        this.userRepo
          .findById(jwtPayload.id)
          .then((user) => {
            if (user !== null) {
              done(null, user)
              return
            }

            const error = new AuthenticationError(
              'Invalid token. User not found.'
            )
            done({ error }, false)
          })
          .catch((error) => {
            done({ error }, false)
          })
      })
    )
  }
}

import * as React from 'react'
import { WelcomeStep } from './welcome'
import { LinkButton } from '../lib/link-button'
import { Dispatcher } from '../dispatcher'
import { Octicon, OcticonSymbol } from '../octicons'
import { Button } from '../lib/button'
import { Loading } from '../lib/loading'
import { BrowserRedirectMessage } from '../lib/authentication-form'

/**
 * The URL to the sign-up page on GitHub.com. Used in conjunction
 * with account actions in the app where the user might want to
 * consider signing up.
 */
export const CreateAccountURL = 'https://github.com/join?source=github-desktop'

interface IStartProps {
  readonly advance: (step: WelcomeStep) => void
  readonly dispatcher: Dispatcher
  readonly loadingBrowserAuth: boolean

  /**
   * Whether or not GitHub.com supports authenticating with username
   * and password or if we have to enforce the web flow
   */
  readonly dotComSupportsBasicAuth: boolean
}

/** The first step of the Welcome flow. */
export class Start extends React.Component<IStartProps, {}> {
  public render() {
    return (
      <div id="start">
        <h1 className="welcome-title">Welcome to GitHub&nbsp;Desktop</h1>
        {!this.props.loadingBrowserAuth ? (
          <>
            <p className="welcome-text">
              GitHub Desktop is a seamless way to contribute to projects on
              GitHub and GitHub Enterprise Server. Sign in below to get started
              with your existing projects.
            </p>
            <p className="welcome-text">
              New to GitHub?{' '}
              <LinkButton
                uri={CreateAccountURL}
                className="create-account-link"
              >
                Create your free account.
              </LinkButton>
            </p>
          </>
        ) : (
          <p>{BrowserRedirectMessage}</p>
        )}

        <div className="welcome-main-buttons">
          <Button
            type="submit"
            className="button-with-icon"
            disabled={this.props.loadingBrowserAuth}
            onClick={this.signInWithBrowser}
          >
            {this.props.loadingBrowserAuth && <Loading />}
            Sign in to GitHub.com
            <Octicon symbol={OcticonSymbol.linkExternal} />
          </Button>
          {this.props.loadingBrowserAuth ? (
            <Button onClick={this.cancelBrowserAuth}>Cancel</Button>
          ) : (
            <Button onClick={this.signInToEnterprise}>
              Sign in to GitHub Enterprise Server
            </Button>
          )}
        </div>
        {/* don't render this link if the user is already mid-browser sign in */}
        {!this.props.loadingBrowserAuth && this.props.dotComSupportsBasicAuth && (
          <div>
            <LinkButton
              onClick={this.signInToDotCom}
              className="basic-auth-link"
            >
              Sign in to GitHub.com using your username and password
            </LinkButton>
          </div>
        )}

        <div className="skip-action-container">
          <LinkButton className="skip-button" onClick={this.skip}>
            Skip this step
          </LinkButton>
        </div>
      </div>
    )
  }

  private signInWithBrowser = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault()
    }

    this.props.advance(WelcomeStep.SignInToDotComWithBrowser)
    this.props.dispatcher.requestBrowserAuthenticationToDotcom()
  }

  private cancelBrowserAuth = () => {
    this.props.advance(WelcomeStep.Start)
  }

  private signInToDotCom = () => {
    this.props.advance(WelcomeStep.SignInToDotCom)
  }

  private signInToEnterprise = () => {
    this.props.advance(WelcomeStep.SignInToEnterprise)
  }

  private skip = () => {
    this.props.advance(WelcomeStep.ConfigureGit)
  }
}

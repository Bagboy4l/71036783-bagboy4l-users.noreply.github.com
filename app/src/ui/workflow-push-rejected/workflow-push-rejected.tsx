import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { Dispatcher } from '../dispatcher'
import { Ref } from '../lib/ref'
import { Repository } from '../../models/repository'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'

interface IWorkflowPushRejectedDialogProps {
  readonly rejectedPath: string
  readonly repository: Repository
  readonly dispatcher: Dispatcher

  readonly onDismissed: () => void
}
interface IWorkflowPushRejectedDialogState {
  readonly loading: boolean
}
/**
 * The dialog shown when a push is rejected due to it modifying a
 * workflow file without the workflow oauth scope.
 */
export class WorkflowPushRejectedDialog extends React.Component<
  IWorkflowPushRejectedDialogProps,
  IWorkflowPushRejectedDialogState
> {
  public constructor(props: IWorkflowPushRejectedDialogProps) {
    super(props)
    this.state = { loading: false }
  }

  public render() {
    return (
      <Dialog
        title={__DARWIN__ ? 'Push Rejected' : 'Push rejected'}
        loading={this.state.loading}
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSignIn}
        type="error"
      >
        <DialogContent>
          <p>
            The push was rejected by the server for containing a modification to
            a workflow file ( <Ref>{this.props.rejectedPath}</Ref>). In order to
            be able to push to workflow files GitHub Desktop needs to request
            additional permissions.
          </p>
          <p>
            Would you like to open a browser to grant GitHub Desktop permission
            to update workflow files?
          </p>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup okButtonText="Grant" />
        </DialogFooter>
      </Dialog>
    )
  }

  private onSignIn = async () => {
    this.setState({ loading: true })

    await this.props.dispatcher.beginDotComSignIn()
    await this.props.dispatcher.requestBrowserAuthentication()

    this.props.dispatcher.push(this.props.repository)
    this.props.onDismissed()
  }
}

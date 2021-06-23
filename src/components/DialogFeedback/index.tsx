import React, { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Alert from '../Alert';
import Button from '../Button';
import Dialog, { DialogProps } from '../Dialog';
import Icon from '../Icon';
import Input from '../Input';
import Spinner from '../Spinner';
import Textarea from '../Textarea';
import useCurrentUser from '../../hooks/useCurrentUser';
import { createFeedbackMessage } from '../../utils/user';

interface DialogFeedbackProps extends DialogProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

const DialogFeedback: FC<DialogFeedbackProps> = ({ onCancel, onSubmit, isOpen, ...rest }) => {
  const { user } = useCurrentUser();

  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const isFormValid = useMemo<boolean>(() => message?.trim().length > 0, [message]);

  const submit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!isFormValid || !user) {
        return;
      }

      try {
        setIsSubmitting(true);
        await createFeedbackMessage(email.trim(), message.trim(), user);
        setHasSubmitted(true);
        setIsSubmitting(false);
        onSubmit?.();
      } catch (err) {
        // TODO error handling
        setIsSubmitting(false);
      }
    },
    [isFormValid, email, message, user, onSubmit]
  );

  const cancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  useEffect(() => {
    // reset the form on close
    if (!isOpen) {
      setMessage('');
      setEmail('');
      setHasSubmitted(false);
    }
  }, [isOpen]);

  // focus on the dialog body on open, to make it easier to tab to the dialog controls
  // TODO eventually the rest of the page should become "inert", so tab focusing is trapped in the dialog
  // TODO make this a reusable useAutofocus() hook
  useEffect(() => {
    if (isOpen) {
      // give the modal time to animate in
      setTimeout(() => emailInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  return (
    <Dialog isOpen={isOpen} onEscapeKey={cancel} onOutsideClick={cancel} {...rest}>
      <form onSubmit={submit}>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="text-lg leading-6 text-gray-900 dark:text-gray-300">
              Give us feedback
            </div>
            <Button size="sm" variant="muted" className="flex-shrink-0" onClick={cancel} outline>
              <Icon name="x-mark" size="sm" />
            </Button>
          </div>
          <div className="my-2">
            {hasSubmitted ? (
              <Alert variant="success" icon="message-check" className="my-6">
                <span className="font-bold">Thanks!</span> Your message has been received. We
                appreciate your feedback!
              </Alert>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Want to report an issue, or have a suggestion on how we can make babel chat even
                  better? Send us a message using the form below, we'd love to hear from you!
                </p>
                <div className="mb-4">
                  <Input
                    ref={emailInputRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email address (optional)"
                    className="mb-2"
                    variant="inverse"
                    fullWidth
                  />
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Only provide an email address if you'd like to hear back from us.
                  </div>
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="Message"
                  className="mb-2"
                  variant="inverse"
                  fullWidth
                />
                <div className="text-xs text-gray-400 dark:text-gray-500">1,000 characters max</div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-20">
          {hasSubmitted ? (
            <>
              <Button variant="link" onClick={cancel}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button variant="link" onClick={cancel}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner
                      size="sm"
                      variant="inverse"
                      className="inline-block mr-2"
                      deferRender={false}
                    />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default DialogFeedback;

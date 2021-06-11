import React, { FC, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Badge from '../../../components/Badge';
import BetaBadge from '../../../components/BetaBadge';
import Button from '../../../components/Button';
import DialogConfirm from '../../../components/DialogConfirm';
import DialogFeedback from '../../../components/DialogFeedback';
import Icon from '../../../components/Icon';
import Link from '../../../components/Link';
import LogoIcon from '../../../components/Svgs/Logos/Icon';
import UserNickname from '../../../components/UserNickname';
import { copyrightLine } from '../../../constants/app';
import useAuth from '../../../hooks/useAuth';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useDrawer from '../../../hooks/useDrawer';
import useNotifications from '../../../hooks/useNotifications';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { signOut } = useAuth();
  const { user } = useCurrentUser();
  const { openDrawer, toggleDrawer, updateTab } = useDrawer();
  const { numUnread } = useNotifications();

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState<boolean>(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState<boolean>(false);

  const openConfirmSignOut = useCallback(() => {
    setIsSignOutConfirmOpen(true);
  }, []);

  const closeConfirmSignOut = useCallback(() => {
    setIsSignOutConfirmOpen(false);
  }, []);

  const confirmSignOut = useCallback(() => {
    closeConfirmSignOut();
    signOut();
  }, [closeConfirmSignOut, signOut]);

  const openAllUsers = useCallback(() => {
    openDrawer();
    updateTab('tab-users');
  }, [openDrawer, updateTab]);

  const openAllChats = useCallback(() => {
    openDrawer();
    updateTab('tab-chats');
  }, [openDrawer, updateTab]);

  const openUsersSearch = useCallback(() => {
    openAllUsers();
    // TODO this isn't great.. see if we can find a better way
    setTimeout(
      () => document.querySelector<HTMLInputElement>('[data-users-search-input="true"]')?.focus(),
      1
    );
  }, [openAllUsers]);

  const openUsersFilters = useCallback(() => {
    openAllUsers();
    // TODO this isn't great.. see if we can find a better way
    setTimeout(() => {
      const toggle = document.querySelector<HTMLButtonElement>(
        '[data-users-filters-toggle="true"][aria-expanded="false"]'
      );

      // if the filters toggle is NOT expanded, expand it
      if (toggle) {
        toggle.click();
      }

      // then focus on the Add a filter... button
      document.querySelector<HTMLButtonElement>('[data-users-filters-add="true"]')?.focus();
    }, 1);
  }, [openAllUsers]);

  const openGiveFeedback = useCallback(() => {
    setIsFeedbackDialogOpen(true);
  }, []);

  return (
    <div className="Index flex flex-col flex-1">
      <Helmet>
        <title>Dashboard | babel chat</title>
      </Helmet>
      <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-3 min-h-navbar bg-green-500 text-white">
        <Button
          onClick={toggleDrawer}
          variant="inverse"
          className="relative mr-2 md:hidden"
          outline
        >
          <Icon name="bars" size="sm" className="inline-block" />
          {!!numUnread && (
            <Badge
              className="absolute -right-1 -top-1"
              tooltip={
                numUnread
                  ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
                  : ''
              }
            />
          )}
        </Button>
        {/* TODO [future] dark mode switch and mute toggle in (right aligned in navbar) */}
      </div>
      <div className="flex-1 flex overflow-y-auto">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 2xl:flex">
            <div className="2xl:w-2/3 mx-4 mt-4">
              <div className="mb-6 py-4 pr-8 bg-gradient-to-l from-green-200 rounded-r-lg">
                <div className="text-right text-sm">
                  Signed in as {!!user && <UserNickname user={user} className="inline" />} (
                  <Button variant="link" size="sm" onClick={openConfirmSignOut} inline>
                    sign out
                  </Button>
                  )
                </div>
                <div className="relative flex justify-end py-4">
                  {/* TODO subtle looping floating/bobbing animation w/CSS animations */}
                  <LogoIcon className="h-40 opacity-50" />
                  <div className="absolute inset-0 py-8">
                    <h1 className="text-4xl font-light mb-2">
                      <span className="relative">
                        Welcome to <span className="font-normal text-gray-600">babel</span>{' '}
                        <span className="font-normal text-green-500">chat</span>
                        <BetaBadge className="-top-1 -right-8" target="_blank" small />
                      </span>
                    </h1>
                    <h2 className="text-lg text-gray-500 mb-6">
                      Meet and chat with people from around the world.
                    </h2>
                    {/* TODO put social/share/donate widgets here */}
                  </div>
                </div>
              </div>
              <div className="flex mb-2">
                <div className="w-1/3">
                  <div className="mb-4 mr-4">
                    {/* TODO create <TileButton> */}
                    <button
                      className="w-full px-4 py-8 flex flex-col items-center bg-white text-gray-500 font-bold border border-gray-100 shadow hover:shadow-md rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-green-300"
                      onClick={openUsersSearch}
                    >
                      <Icon name="magnifying-glass" size="lg" className="mb-4" />
                      Search for users
                    </button>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="mb-4 mr-4">
                    <button
                      className="w-full px-4 py-8 flex flex-col items-center bg-white text-gray-500 font-bold border border-gray-100 shadow hover:shadow-md rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-green-300"
                      onClick={openUsersFilters}
                    >
                      <Icon name="filter" size="lg" className="mb-4" />
                      Add advanced filters
                    </button>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="mb-4">
                    <button
                      className="w-full px-4 py-8 flex flex-col items-center bg-white text-gray-500 font-bold border border-gray-100 shadow hover:shadow-md rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-green-300"
                      onClick={openGiveFeedback}
                    >
                      <Icon name="message-pen" size="lg" className="mb-4" />
                      Give us feedback
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-6 2xl:mb-2 p-4 rounded-lg bg-gray-50">
                <h3 className="text-xl text-gray-600 mb-2">New here?</h3>
                <p className="mb-4 text-gray-800 max-w-3xl">
                  Welcome to the babel chat community! We hope you enjoy your stay. Here's a few
                  tips and tricks to make sure you have the best possible chat experience:
                </p>
                <ul className="list-disc pl-8 mb-4 text-gray-800 max-w-3xl">
                  <li className="mb-1">
                    <strong className="font-bold">It is completely anonymous.</strong> babel chat
                    does not require you to provide any personal information, and has no
                    registration process. Some users choose to provide some very basic information
                    such as age and gender, but this is and will always be{' '}
                    <strong className="font-bold">100% optional</strong>.
                  </li>
                  <li className="mb-1">
                    <strong className="font-bold">Find people easily.</strong> Use the{' '}
                    <Icon name="filter" size="sm" className="inline-block text-gray-400" />{' '}
                    "Advanced filters" search feature to only show users from certain countries, age
                    ranges and more. (You can even add multiple filters of the same type to broaden
                    your search!)
                  </li>
                  <li className="mb-1">
                    <strong className="font-bold">Chat everywhere.</strong> babel chat is designed
                    to work on any device, including mobile phones, iPads and other tablets, and
                    desktop PCs. So you can take babel chat everywhere you go!
                  </li>
                  <li className="mb-1">
                    <strong className="font-bold">Be safe!</strong> Never give out detailed personal
                    information to complete strangers. Don’t open links unless you are absolutely
                    sure it is a trusted and legitimate website.
                  </li>
                </ul>
              </div>
            </div>
            <div className="my-4 mr-4 ml-4 flex 2xl:block 2xl:flex-1">
              <div className="mb-8 w-1/2 2xl:w-auto mr-2 2xl:mr-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl text-gray-600">Newest users</h3>
                  <Button variant="link" size="sm" onClick={openAllUsers}>
                    View all
                  </Button>
                </div>
              </div>
              <div className="mb-8 w-1/2 2xl:w-auto ml-2 2xl:ml-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl text-gray-600">Latest chats</h3>
                  <Button variant="link" size="sm" onClick={openAllChats}>
                    View all
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 px-4 py-4 text-sm text-gray-400">
            {copyrightLine} <span className="hidden md:inline">&bull;</span>{' '}
            <span className="block md:inline">
              <Link to="/privacy-policy" target="_blank">
                privacy policy
              </Link>{' '}
              &bull;{' '}
              <Link to="/terms-of-use" target="_blank">
                terms of use
              </Link>
            </span>
          </div>
        </div>
      </div>

      <DialogFeedback
        isOpen={isFeedbackDialogOpen}
        onCancel={() => setIsFeedbackDialogOpen(false)}
      />
      <DialogConfirm
        isOpen={isSignOutConfirmOpen}
        onCancel={closeConfirmSignOut}
        onConfirm={confirmSignOut}
        confirmText="Sign out"
        title="Sign out"
        icon="right-from-bracket"
        message="Are you sure you want to sign out?"
      />
    </div>
  );
};

export default Index;

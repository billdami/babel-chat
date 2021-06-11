import React, { FC, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';

import Badge from '../../../components/Badge';
import BetaBadge from '../../../components/BetaBadge';
import Button from '../../../components/Button';
import DialogConfirm from '../../../components/DialogConfirm';
import DialogFeedback from '../../../components/DialogFeedback';
import Icon from '../../../components/Icon';
import Link from '../../../components/Link';
import RelativeTime from '../../../components/RelativeTime';
import Spinner from '../../../components/Spinner';
import LogoIcon from '../../../components/Svgs/Logos/Icon';
import UserAvatar from '../../../components/UserAvatar';
import UserDetails from '../../../components/UserDetails';
import UserNickname from '../../../components/UserNickname';
import { copyrightLine } from '../../../constants/app';
import useAuth from '../../../hooks/useAuth';
import { useLatestChats } from '../../../hooks/useChatRecord';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useDrawer from '../../../hooks/useDrawer';
import useNotifications from '../../../hooks/useNotifications';
import { useNewestUsers } from '../../../hooks/useUserRecord';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { signOut, user: authUser } = useAuth();
  const { user } = useCurrentUser();
  const { openDrawer, toggleDrawer, updateTab } = useDrawer();
  const { numUnread } = useNotifications();
  const [newestUsers, isLoadingUsers] = useNewestUsers();
  const [latestChats, isLoadingChats] = useLatestChats(authUser?.uid);

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
                  <LogoIcon className="h-40 opacity-30 md:opacity-50" />
                  <div className="absolute inset-0 py-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-light mb-2">
                      <span className="relative">
                        Welcome to <span className="font-normal text-gray-600">babel</span>{' '}
                        <span className="font-normal text-green-500">chat</span>
                        <BetaBadge
                          className="-top-2 -right-10 md:-top-1 md:-right-8"
                          target="_blank"
                          small
                        />
                      </span>
                    </h1>
                    <h2 className="text-base md:text-lg text-gray-500 mb-6">
                      Meet and chat with people from around the world.
                    </h2>
                    {/* TODO put social/share/donate widgets here */}
                  </div>
                </div>
              </div>
              <div className="lg:flex mb-2">
                <div className="lg:w-1/3">
                  <div className="mb-4 lg:mr-4">
                    {/* TODO create <Button variant="tile"> */}
                    <button
                      className="w-full px-4 py-8 flex flex-col items-center bg-white text-gray-500 font-bold border border-gray-100 shadow hover:shadow-md rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-green-300"
                      onClick={openUsersSearch}
                    >
                      <Icon name="magnifying-glass" size="lg" className="mb-4" />
                      Search for users
                    </button>
                  </div>
                </div>
                <div className="lg:w-1/3">
                  <div className="mb-4 lg:mr-4">
                    <button
                      className="w-full px-4 py-8 flex flex-col items-center bg-white text-gray-500 font-bold border border-gray-100 shadow hover:shadow-md rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-green-300"
                      onClick={openUsersFilters}
                    >
                      <Icon name="filter" size="lg" className="mb-4" />
                      Add advanced filters
                    </button>
                  </div>
                </div>
                <div className="lg:w-1/3">
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
            <div className="my-4 mr-4 ml-4 block lg:flex 2xl:block 2xl:flex-1">
              <div className="mb-8 w-auto lg:w-1/2 2xl:w-auto max-w-md lg:mr-2 2xl:mr-0">
                <div className="flex justify-between sm:justify-start 2xl:justify-between items-center mb-4">
                  <h3 className="text-xl text-gray-600 mr-2">Newest users</h3>
                  {/* TODO if on desktop, and users tab is already open, show a tooltip on click or something */}
                  <Button variant="link" size="sm" onClick={openAllUsers}>
                    View all
                  </Button>
                </div>
                {/* TODO do reverse() in a useMemo */}
                {!!newestUsers?.length && (
                  <div className="-ml-2">
                    {newestUsers?.reverse().map((user) => (
                      <RouterLink
                        key={user.id}
                        className="flex items-center
                          w-full
                          px-2 py-1
                          text-left
                          rounded
                          hover:bg-opacity-50 hover:bg-gray-200
                          focus:outline-none focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
                        to={`/main/chat/${user.id}`}
                      >
                        <div className="relative flex-shrink-0 mr-2">
                          <UserAvatar user={user} className="border border-gray-100" />
                        </div>
                        <div className="truncate flex-1">
                          <div className="flex justify-between items-start">
                            <UserNickname
                              user={user}
                              isCurrentUser={user.id === authUser?.uid}
                              className="text-gray-800"
                            />
                            <div className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                              <RelativeTime date={user.dateSignedIn} />
                            </div>
                          </div>
                          <UserDetails user={user} className="text-gray-400 text-sm" />
                        </div>
                      </RouterLink>
                    ))}
                  </div>
                )}
                {!isLoadingUsers && !newestUsers?.length && (
                  <div className="mb-4 text-sm text-gray-400">No users found</div>
                )}
                {isLoadingUsers && <Spinner />}
              </div>
              <div className="mb-8 w-auto lg:w-1/2 2xl:w-auto max-w-md lg:ml-2 2xl:ml-0">
                <div className="flex justify-between sm:justify-start 2xl:justify-between items-center mb-4">
                  <h3 className="text-xl text-gray-600 mr-2">My latest chats</h3>
                  {/* TODO if on desktop, and chats tab is already open, show a tooltip on click or something */}
                  <Button variant="link" size="sm" onClick={openAllChats}>
                    View all
                  </Button>
                </div>
                {!!latestChats?.length && (
                  <div className="-ml-2">
                    {/* TODO do reverse() in a useMemo */}
                    {latestChats?.reverse().map((chat) => (
                      <RouterLink
                        key={chat.id}
                        className="relative
                          block flex-1 min-w-0
                          px-2 py-1
                          text-left
                          rounded
                          hover:bg-opacity-50 hover:bg-gray-200
                          focus:outline-none
                          focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
                        to={`/main/chat/${chat.id}`}
                      >
                        <div className="flex items-center justify-between min-w-0">
                          <div className="flex items-center min-w-0">
                            <UserAvatar
                              user={chat.toUserDetails}
                              size={20}
                              className="flex-shrink-0 mr-2 border border-gray-100"
                            />
                            <UserNickname
                              user={chat.toUserDetails}
                              className="flex-1 text-gray-800"
                            />
                          </div>
                          <div className="flex items-center">
                            <div className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                              <RelativeTime date={chat.dateLastMessage} />
                            </div>
                            {(!chat.dateLastSeen || chat.dateLastSeen < chat.dateLastMessage) && (
                              <Badge
                                className="flex-shrink-0 ml-1"
                                tooltip="There are unread message(s)"
                                size="md"
                                pulse={false}
                              />
                            )}
                          </div>
                        </div>
                      </RouterLink>
                    ))}
                  </div>
                )}
                {!isLoadingChats && !latestChats?.length && (
                  <div className="mb-4 text-sm text-gray-400">You don't have any open chats 😿</div>
                )}
                {isLoadingChats && <Spinner />}
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

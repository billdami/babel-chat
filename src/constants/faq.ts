import { Faq } from '../types/faq';

export const Faqs: Faq[] = [
  {
    slug: 'what-is-it',
    question: 'What is babel chat?',
    answer:
      'babel chat is a free, easy to use app for meeting and chatting with people from around the world. It features private, one-on-one chats, and the ability to easily filter and search for other users to meet. ',
  },
  {
    slug: 'mobile-use',
    question: 'Can I use babel chat on my phone or tablet?',
    answer:
      'Yes! babel chat was designed from the ground up for mobile phones and tablet devices, as well as desktop PCs. ',
  },
  {
    slug: 'need-an-account',
    question: 'Do I have to create an account?',
    answer:
      'Nope, babel chat is completely anonymous, and requires no registration. To start chatting, you can choose a nickname, and provide some basic information if you’d like, but even that is completely optional. ',
  },
  {
    slug: 'anonymous-user',
    question: 'Why do some users have “Anonymous user” as a nickname?',
    answer:
      'babel chat does not require you to provide any personally identifying information, even a nickname is optional. So if you do not provide one, your user will be displayed to others as “Anonymous user”.',
  },
  {
    slug: 'id-tags',
    question: 'What is the number next to everyone’s nickname?',
    answer:
      'babel chat allows users to choose any nickname they’d like, but to ensure all users have a unique name, a random four digit number, called an “ID tag”, is assigned to everyone and displayed next to their nickname, e.g. “#1234”.',
  },
  {
    slug: 'avatars',
    question: 'What are the weird pictures displayed next to all the users?',
    answer:
      'They are unique avatar icons, that are automatically generated for each user when they sign in. These avatars help make it easier to see who’s who, even if the users are completely anonymous.',
  },
  {
    slug: 'status-icons',
    question: 'What do the little green, yellow, and gray circles next everyone’s nicknames mean?',
    answer:
      'These icons indicate the user’s active status. Green means the user is currently active, yellow means they recently became idle, and gray means they are away, and haven’t been active in awhile.',
  },
  {
    slug: 'advanced-filters',
    question:
      'How can I find users from a specific country, or of a specific gender, or age range?',
    answer:
      'You can easily filter the main users list in babel chat to only show the users you are interested in chatting with. To do so, open “Advanced filters” by tapping the button with the filter icon to the right of the search bar, and then tap “Add a filter…”. From there, you can add multiple different filters to search by nickname, country, gender, and age range, and the users list will automatically update to only show matching results.',
  },
  {
    slug: 'pin-chats',
    question: 'What does “Pin chat” do?',
    answer:
      'Pinning a chat allows you to keep certain chats at the top of your Chats list, so that they are always easily accessible, no matter how many new chats you receive! You can pin a chat via the “Chat options” menu when in the main chat screen, or by tapping “Edit chats” in the main chats list, or finally by tapping the “…” button when hovering over a chat in the list (desktop only). Pinned chats can be unpinned via this same process.',
  },
  {
    slug: 'block-user',
    question: 'Can I block another user?',
    answer:
      'Yes, if you no longer want to receive messages from another user, you may block them by tapping the “Block user” option in the “Chat options” menu when in the main chat screen. This will also cause the chat to be closed and removed from your chats list. You may later unblock by opening a new chat with them and using the “Unblock user” option in the “Chat options” menu. Blocked users are indicated in the main users list by a line through their name.',
  },
  {
    slug: 'report-spam',
    question: 'What does “Report spam” do?',
    answer:
      'If you think another user is abusing babel chat, for example by attempting to have users open suspicious links, you may report them as spam by tapping the “Report spam” option in the “Chat options” menu when in the main chat screen with that user. Reporting another user as spam will permanently block that user from being able to message you, as well as send an anonymous report to babel chat. If enough users report someone as spam, that user may eventually be banned from babel chat.',
  },
  {
    slug: 'dark-mode',
    question: 'Does babel chat have a dark theme?',
    answer:
      'Yes! To enable dark mode in babel chat, use the green switch found on the top right of the page (or bottom of the page on mobile devices) when signed out, or in the user menu when signed in.',
  },
  {
    slug: 'mute-sounds',
    question: 'Can I mute notification sounds?',
    answer:
      'babel chat will play a sound when new messages are received, but these sounds can be disabled by clicking the “Mute” switch, which is accessible in the user menu.',
  },
];

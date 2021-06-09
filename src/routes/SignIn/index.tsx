import React, { createRef, FC, FormEvent, useCallback, useMemo, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { Age, Gender } from '../../types/user';
import {
  GENDERS,
  MAX_AGE,
  MAX_NICKNAME_LEN,
  MIN_AGE,
  MIN_NICKNAME_LEN,
  UNSPECIFIED,
} from '../../constants/user';
import Button from '../../components/Button';
import { COUNTRIES } from '../../constants/countries';
import Checkbox from '../../components/Checkbox';
import { Country } from '../../types/country';
import ErrorText from '../../components/FormControl/ErrorText';
import FormControl from '../../components/FormControl';
import Input from '../../components/Input';
import Link from '../../components/Link';
import Radio from '../../components/Radio';
import Select, { SelectOption } from '../../components/Select';
import Logo from '../../components/Svgs/Logos/Logo';
import Spinner from '../../components/Spinner';
import BetaBadge from '../../components/BetaBadge';
import useAuth from '../../hooks/useAuth';
import useScrollToTop from '../../hooks/useScrollToTop';
import { copyrightLine } from '../../constants/app';
import { envVar } from '../../utils/env';
import { ReCaptchaError, ReCaptchaLoadError, SignInError } from '../../errors/auth';

interface SignInListProps {}

const ageOptions = [
  { value: UNSPECIFIED, label: 'Prefer not to say' },
  ...Array.from(new Array(MAX_AGE - MIN_AGE + 1)).map((v, i) => ({
    value: `${MIN_AGE + i}`,
    label: `${MIN_AGE + i}`,
  })),
];

const countryGroups = ['Frequently used', 'All countries'];
const countryOptions: SelectOption<Country>[] = [
  { value: Country.UNSPECIFIED, label: 'Prefer not to say' },
  ...COUNTRIES.filter((c) => c.prioritized).map((c) => ({ ...c, group: 'Frequently used' })),
  ...COUNTRIES.filter((c) => !c.prioritized).map((c) => ({ ...c, group: 'All countries' })),
];

const SignIn: FC<SignInListProps> = () => {
  useScrollToTop();
  const { isSigningIn, signIn } = useAuth();

  const captcha = createRef<ReCAPTCHA>();

  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [captchaHasErrored, setCaptchaHasErrored] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [country, setCountry] = useState<Country>(Country.UNSPECIFIED);
  const [age, setAge] = useState<Age>(UNSPECIFIED);
  const [gender, setGender] = useState<Gender>(Gender.UNSPECIFIED);
  const [agreedToToS, setAgreedToToS] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isFormValid = useMemo<boolean>(
    () =>
      (nickname?.trim().length === 0 ||
        (nickname?.trim().length >= MIN_NICKNAME_LEN &&
          nickname?.trim().length <= MAX_NICKNAME_LEN)) &&
      agreedToToS,
    [nickname, agreedToToS]
  );

  const onCaptchaExpired = useCallback(() => captcha.current?.reset(), [captcha]);

  const onCaptchaErrored = useCallback(() => {
    setCaptchaHasErrored(true);
    setSubmitError(new ReCaptchaLoadError().message);
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!isFormValid) {
        return;
      }

      try {
        let _captchaToken: string | null = captchaToken;

        if (!_captchaToken) {
          if (!captcha.current || captchaHasErrored) {
            throw new ReCaptchaLoadError();
          }

          _captchaToken = await captcha.current.executeAsync();
          if (_captchaToken) {
            setCaptchaToken(_captchaToken);
          }
        }

        await signIn(_captchaToken, {
          nickname: nickname?.trim(),
          country,
          age,
          gender,
          agreedToToS,
        });
      } catch (err) {
        setSubmitError(
          err instanceof SignInError ||
            err instanceof ReCaptchaError ||
            err instanceof ReCaptchaLoadError
            ? err.message
            : 'Unable to sign in. Please try again.'
        );
      }
    },
    [
      signIn,
      isFormValid,
      nickname,
      country,
      age,
      gender,
      agreedToToS,
      captcha,
      captchaToken,
      captchaHasErrored,
    ]
  );

  return (
    <div className="mx-auto my-auto px-4 pt-4 pb-20 md:pb-4">
      <div className="w-full sm:w-116">
        <div className="flex justify-center mx-auto mb-4 md:mb-6 mt-2 md:mt-0">
          <div className="relative">
            <Logo className="h-20 md:h-24 max-w-full" />
            <BetaBadge className="-top-2 -right-4 md:-right-8" />
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-4 md:p-6 mb-4 bg-white rounded text-gray-700">
          <p className="mb-4 md:mb-6">
            <span className="text-gray-500 font-bold">babel chat</span> is free and completely
            anonymous. If you’d like, you can provide some basic info below, but it is{' '}
            <span className="font-bold">100% optional.</span>
          </p>

          <FormControl label="Nickname" htmlFor="signup-nickname">
            <Input
              placeholder="Leave blank for a random nickname"
              id="signup-nickname"
              autoComplete="nickname"
              maxLength={MAX_NICKNAME_LEN}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
            />
          </FormControl>

          <FormControl label="Country" htmlFor="signup-country">
            <Select
              id="signup-country"
              value={country}
              groups={countryGroups}
              options={countryOptions}
              onChange={(e) => setCountry(e.target.value as Country)}
              fullWidth
            />
          </FormControl>

          <FormControl label="Age" htmlFor="signup-age">
            <Select
              id="signup-age"
              value={`${age}`}
              options={ageOptions}
              onChange={(e) =>
                setAge(e.target.value !== UNSPECIFIED ? Number(e.target.value) : UNSPECIFIED)
              }
              fullWidth
            />
          </FormControl>

          <FormControl label="Gender">
            <div className="flex flex-wrap">
              {GENDERS.map((g) => (
                <Radio
                  key={g.value}
                  className="mr-3"
                  label={g.label}
                  name="gender"
                  id={`gender-${g.value}`}
                  value={g.value}
                  checked={gender === g.value}
                  onChange={(e) => setGender(e.target.value as Gender)}
                />
              ))}
            </div>
          </FormControl>

          <Checkbox
            type="checkbox"
            id="agreed-to-tos"
            className="my-6"
            checked={agreedToToS}
            onChange={(e) => setAgreedToToS(e.target.checked)}
          >
            I am over 18 and agree to the{' '}
            <Link to="/terms-of-use" target="_blank">
              terms <span className="hidden md:inline">of use</span>
            </Link>
          </Checkbox>

          <ReCAPTCHA
            ref={captcha}
            onExpired={onCaptchaExpired}
            onErrored={onCaptchaErrored}
            sitekey={envVar('CAPTCHA_SITE_KEY')!}
            size="invisible"
            badge="bottomright"
            // TODO set based on light or dark app theme setting
            theme="light"
          />

          <Button type="submit" size="lg" disabled={!isFormValid || isSigningIn} fullWidth>
            {isSigningIn ? (
              <>
                <Spinner
                  size="sm"
                  variant="inverse"
                  className="inline-block mr-2"
                  deferRender={false}
                />
                Signing in...
              </>
            ) : (
              'Start chatting'
            )}
          </Button>
          {!!submitError && <ErrorText className="mt-2 font-bold" text={submitError} />}
        </form>
        <div className="text-sm text-gray-400 text-center">
          {copyrightLine}
          <br />{' '}
          <Link to="/privacy-policy" target="_blank">
            privacy policy
          </Link>{' '}
          &bull;{' '}
          <Link to="/terms-of-use" target="_blank">
            terms of use
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ContentTemplate } from "../../shared";
import { Input } from "../../shared/Input";
import { useChatCredentials } from '../../../requests/queries'

import classNames from "./support.module.scss";
import { useUpdateChatCredentials } from "../../../requests/mutations";
import { useEffect } from "react";

const chatFormDTO = z.object({
  id: z.string().min(1),
  origin: z.string().min(1),
});

type TChatFormArgs = z.infer<typeof chatFormDTO>;

export default function SupportPage() {
  const { t } = useTranslation();
  const { data, isFetching } = useChatCredentials();
  const { updateChatCredentials, isFetching: isUpdating } = useUpdateChatCredentials();

  console.log(data);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<TChatFormArgs>({ resolver: zodResolver(chatFormDTO) });

  useEffect(() => {
    if (data?.id) setValue("id", data.id);
    if (data?.origin) setValue("origin", data.origin);
  }, [data, setValue])

  const onSubmit: SubmitHandler<TChatFormArgs> = (data) => {
    console.log("a", data);
    updateChatCredentials(data);
  }

  // TODO: translations for errors
  return (
    <ContentTemplate disabled={!isValid || isFetching || isUpdating} isSubmitting={isUpdating} onSubmit={handleSubmit(onSubmit)} className={classNames.form}>
      <Input
        {...register("origin")}
        className={classNames.form__input}
        label={t("Chat") + " " + t("origin")}
        disabled={isFetching || isUpdating}
        error={errors.origin ? "error" : undefined}
      />
      <Input
        {...register("id")}
        className={classNames.form__input}
        disabled={isFetching || isUpdating}
        label={t("Chat") + " " + t("id")}
        error={errors.id ? "error" : undefined}
      />
    </ContentTemplate>
  );
}

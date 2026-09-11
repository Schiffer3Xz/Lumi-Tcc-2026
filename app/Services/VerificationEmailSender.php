<?php

namespace App\Services;

use App\Models\User;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class VerificationEmailSender
{
    public const ERROR_MESSAGE = 'Não foi possível enviar o e-mail de verificação. Tente reenviar. Se o problema persistir, contate o responsável pelo sistema.';

    public function send(User $user): bool
    {
        try {
            $user->sendEmailVerificationNotification();
        } catch (TransportExceptionInterface $exception) {
            report($exception);

            return false;
        }

        return true;
    }
}

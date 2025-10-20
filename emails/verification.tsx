import { getScopedI18n } from "@/locales/server";
import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Tailwind,
    Text
} from "@react-email/components";


interface VerificationTemplateProps {
    userName: string;
    code: string;
}

const VerificationTemp: React.FC<Readonly<VerificationTemplateProps>> = async ({
    userName = "X",
    code = "46590",
}) => {
    const scopedT = await getScopedI18n('emails.verification')
    return (
        <Html>
            <Head />
            <Preview>{scopedT('preview')}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="p-6 m-10 mx-auto bg-white">
                        <Text className="mb-4 text-lg">{scopedT('greeting', { userName })}</Text>
                        <Text className="text-base font-semibold text-center">
                            {scopedT('message')}
                        </Text>
                        <Section className="mt-4 text-center">
                            <div className="inline-block px-6 py-3 text-xl font-bold tracking-[10px] text-slate-900">
                                {code}
                            </div>
                            <Text className="mt-2.5 text-sm">
                                {scopedT('expires')}
                            </Text>
                        </Section>
                        <Text className="mt-8 text-base">
                            {scopedT('closing')}
                            <br />
                            <span className="font-bold">{scopedT('signature')}</span>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default VerificationTemp;
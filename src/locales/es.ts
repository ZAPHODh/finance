import shared from './shared/es'
import common from './common/es'
import entities from './entities/es'
import navigation from './navigation/es'
import dashboard from './dashboard/es'
import financial from './financial/es'
import configuration from './configuration/es'
import reports from './reports/es'
import marketing from './marketing/es'
import ui from './ui/es'
import auth from './auth/es'
import emails from './emails/es'

export default {
    shared,
    common,
    entities,
    navigation,
    dashboard,
    financial,
    configuration,
    reports,
    marketing,
    ui,
    auth,
    emails,
} as const

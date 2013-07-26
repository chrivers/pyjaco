for index in [1,2]:
    try:
        print 'raising exception...'
        if index==1:
            raise ValueError('bar')
        elif index==2:
            raise TypeError('foo')
    except ValueError, ex2:
        print 'caught other exception:' + ex2.message
    except TypeError, ex:
        print 'caught exception:' + ex.message
    finally:
        print 'and finally...'
